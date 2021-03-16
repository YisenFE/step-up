import http from 'http';
import path from 'path';
import crypto from 'crypto';

import mime from 'mime';
import ejs from 'ejs';
import fs from 'mz/fs';
import chalk from 'chalk';
import template from './template';

// NOTE: ts不会将html文件编译进dist目录
// const template = fs.readFileSync(path.resolve(__dirname, './template.ts')).toString();

const log = console.log;

export enum CacheMode {
    Force = 'force',
    SimpleWeak = 'simpleWeak',
    Weak = 'weak'
};

export interface ServerOptions {
    port: string;
    host: string;
    dir: string;
    cacheMode: CacheMode;
}

/**
 * http服务
 */
export class Server {
    public template: string;
    constructor(public options: ServerOptions) {
        this.template = template;
    }
    /**
     * 创建一个server实例
     */
    start() {
        const server = http.createServer(this.requestListener.bind(this));
        server.listen(this.options, () => {
            const { dir, host, port } = this.options;
            log(
                `- Starting up http-server,\n`
                + `- dirPath:\n`
                + `    ${dir}\n`
                + `- mode:\n`
                + `    ${this.options.cacheMode}\n`
                + `- Available on:\n`
                + chalk.green(`   http://${host}:${port}`)
            );
        });
    }
    /**
     * 请求监听器
     * @param this Server
     * @param req http://nodejs.cn/api/http.html#http_class_http_incomingmessage
     * @param res http://nodejs.cn/api/http.html#http_class_http_serverresponse
     */
    async requestListener(this: Server, req: http.IncomingMessage, res: http.ServerResponse) {
        try {
            const { pathname } = new URL(req.url || '/', `http://${req.headers.host}`);
            const absPath = path.join(this.options.dir, pathname);
            const stats = await fs.stat(absPath);
            if (stats.isDirectory()) {
                const dirs = await fs.readdir(absPath);
                const renderTpl = ejs.render(
                    this.template,
                    {
                        arr: dirs.map(dir => ({
                            href: path.join(pathname, dir),
                            content: dir
                        }))
                    }
                );
                res.setHeader('Content-Type', 'text/html;charset=utf-8');
                res.end(renderTpl);
            } else {
                this.sendFile(req, res, stats, absPath);
            }
        } catch (error) {
            // log(error);
            this.sendError(res);
        }
    }
    /**
     * 响应404
     * @param res http://nodejs.cn/api/http.html#http_class_http_serverresponse
     */
    sendError(res: http.ServerResponse) {
        res.statusCode = 404;
        res.end('Not Found');
    }
    /**
     * 响应200/304
     * @param req http://nodejs.cn/api/http.html#http_class_http_incomingmessage
     * @param res http://nodejs.cn/api/http.html#http_class_http_serverresponse
     * @param stats http://nodejs.cn/api/fs.html#fs_class_fs_stats
     * @param absPath 绝对路径
     */
    sendFile(
        req: http.IncomingMessage,
        res: http.ServerResponse,
        stats: fs.Stats,
        absPath: string
    ) {
        switch (this.options.cacheMode) {
            case CacheMode.Force:
                this.forcingCache(req, res, absPath);
                break;
            case CacheMode.SimpleWeak:
                this.simpleWeakCache(req, res, stats, absPath);
                break;
            case CacheMode.Weak:
                this.weakCache(req, res, absPath);
                break;
        }
    }
    /**
     * 强缓存
     * @param req http://nodejs.cn/api/http.html#http_class_http_incomingmessage
     * @param res http://nodejs.cn/api/http.html#http_class_http_serverresponse
     * @param absPath 绝对路径
     */
    forcingCache(
        req: http.IncomingMessage,
        res: http.ServerResponse,
        absPath: string
    ) {
        // 强缓存
        res.setHeader('Cache-Control', 'max-age=1000');
        res.setHeader('Expires', new Date(Date.now() + 1000 * 1000).toGMTString());

        log(req.url);
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        fs.createReadStream(absPath).pipe(res);
    }
    /**
     * 简化版协商缓存
     * @param req http://nodejs.cn/api/http.html#http_class_http_incomingmessage
     * @param res http://nodejs.cn/api/http.html#http_class_http_serverresponse
     * @param stats http://nodejs.cn/api/fs.html#fs_class_fs_stats
     * @param absPath 绝对路径
     * @returns undefined
     */
    simpleWeakCache(
        req: http.IncomingMessage,
        res: http.ServerResponse,
        stats: fs.Stats,
        absPath: string
    ) {
        res.setHeader('Last-Modified', stats.ctime.toGMTString());
        const clientDate = req.headers['if-modified-since'];
        const serverDate = stats.ctime.toGMTString();
        if (clientDate === serverDate) {
            res.statusCode = 304;
            res.end();
            return;
        }
        res.setHeader('Last-Modified', serverDate);
        res.setHeader('Cache-Control', 'no-cache');

        log(req.url);
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        fs.createReadStream(absPath).pipe(res);
    }
    /**
     * 协商缓存
     * @param req http://nodejs.cn/api/http.html#http_class_http_incomingmessage
     * @param res http://nodejs.cn/api/http.html#http_class_http_serverresponse
     * @param absPath 绝对路径
     * @returns undefined
     */
    weakCache(
        req: http.IncomingMessage,
        res: http.ServerResponse,
        absPath: string
    ) {
        res.setHeader('Cache-Control', 'no-cache');

        res.setHeader('Content-Type', 'text/html;charset=utf-8');

        const rs = fs.createReadStream(absPath);
        const md5 = crypto.createHash('md5');
        const arr: Buffer[] = [];
        rs.on('data', (chunk: Buffer) => {
            md5.update(chunk);
            arr.push(chunk);
        });
        rs.on('end', () => {
            const serverData = md5.digest('base64');
            const clientDate = req.headers['if-none-match']
            if (serverData === clientDate) {
                res.statusCode = 304;
                res.end();
                return;
            }
            res.setHeader('ETag', serverData);
            res.end(Buffer.concat(arr));
        });
    }
}
