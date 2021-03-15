import http from 'http';
import path from 'path';

import mime from 'mime';
import ejs from 'ejs';
import fs from 'mz/fs';
import chalk from 'chalk';
import template from './template';

// NOTE: ts不会将html文件编译进dist目录
// const template = fs.readFileSync(path.resolve(__dirname, './template.ts')).toString();

const log = console.log;

export interface ServerOptions {
    port: string;
    host: string;
    dir: string;
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
            log(chalk.yellow(
                `Starting up http-server,\n`
                + `serving:\n`
                + `    ${dir}\n`
                + `Available on:\n`
                + chalk.green(`   http://${host}:${port}`)
            ));
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
        // this.forcingCache(req, res, absPath);
        this.weakCache(req, res, stats, absPath);
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
     * 协商缓存
     * @param req http://nodejs.cn/api/http.html#http_class_http_incomingmessage
     * @param res http://nodejs.cn/api/http.html#http_class_http_serverresponse
     * @param stats http://nodejs.cn/api/fs.html#fs_class_fs_stats
     * @param absPath 绝对路径
     * @returns undefined
     */
    weakCache(
        req: http.IncomingMessage,
        res: http.ServerResponse,
        stats: fs.Stats,
        absPath: string
    ) {
        // 协商缓存
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
}
