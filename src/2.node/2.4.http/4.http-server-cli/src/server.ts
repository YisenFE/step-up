import http from 'http';
import path from 'path';

import mime from 'mime';
import ejs from 'ejs';
import fs from 'mz/fs';
import chalk from 'chalk';
import template from './template';

// NOTE: ts不会将html文件编译进dist目录
// const template = fs.readFileSync(path.resolve(__dirname, './template.ts')).toString();
console.log(template)

const log = console.log;

export interface ServerOptions {
    port: string;
    host: string;
    dir: string;
}
export class Server {
    public template: string;
    constructor(public options: ServerOptions) {
        this.template = template;
    }
    async handleRequest(this: Server, req: http.IncomingMessage, res: http.ServerResponse) {
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
                this.sendFile(req, res, absPath);
            }
        } catch (error) {
            console.log(error);
            this.sendError(res);
        }
    }
    sendError(res: http.ServerResponse) {
        res.statusCode = 404;
        res.end('Not Found');
    }
    sendFile(req: http.IncomingMessage,res: http.ServerResponse, absPath: string) {
        res.setHeader('Cache-Control', 'max-age=1000');
        res.setHeader('Expires', new Date(Date.now() + 1000 * 1000).toGMTString());
        console.log(req.url);
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        fs.createReadStream(absPath).pipe(res);
    }
    start() {
        const server = http.createServer(this.handleRequest.bind(this));
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
}
