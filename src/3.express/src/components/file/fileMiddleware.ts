// Types
import express, { Express, Response } from 'express';
import { ServeStaticOptions } from 'serve-static';

/**
 * 中间件
 */
export class FileMiddleware {
    constructor(path: string, app: Express) {
        const options: ServeStaticOptions<Response> = {
            dotfiles: 'ignore',
            etag:true,
            extensions: ['htm', 'html'],
            maxAge: '1d',
            redirect: false,
            setHeaders: function (res, path, stat) {
                console.log(path);
                res.set('x-timestamp', Date.now().toString())
            }
        };
        app.use(path, express.static('public', options));
    }
}
