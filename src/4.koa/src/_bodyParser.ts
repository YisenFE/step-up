/// <reference path="../types/global.d.ts" />
import Koa from 'koa';
import querystring from 'querystring';
import _serve from './_static';
import { resolve } from 'path';

export function _bodyParser() {
    return async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
        const arr : Buffer[] = [];
        ctx.req.on('data', (chunk: Buffer) => {
            arr.push(chunk);
        });
        await new Promise<void>((resolve) => {

            ctx.req.on('end', () => {
                if (ctx.get('Content-Type') === 'application/x-www-form-urlencoded') {
                    ctx.request.body = querystring.parse(Buffer.concat(arr).toString());
                }
                else if (ctx.get('Content-Type') === 'application/json') {
                    ctx.request.body = JSON.parse(Buffer.concat(arr).toString());
                }
                else {
                    ctx.request.body = {};
                }
                resolve();
            });
        });
        await next();
    }
}



const app = new Koa();
const port = 3000;
// listener();
function listener() {
    app.use(_serve(resolve(__dirname, '../')));
    app.use(async (ctx, next) => {
        if (ctx.path === '/upload' && ctx.method === 'POST') {
            await bodyParser(ctx, next);
        } else {
            await next();
        }
    });
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });

    async function bodyParser(ctx: Koa.ParameterizedContext, next: Koa.Next) {
        const arr : Buffer[] = [];
        ctx.req.on('data', (chunk: Buffer) => {
            arr.push(chunk);
        });
        await new Promise<void>((resolve) => {
            ctx.req.on('end', () => {
                if (ctx.get('Content-Type') === 'application/x-www-form-urlencoded') {
                    ctx.body = querystring.parse(Buffer.concat(arr).toString());
                } else {
                    ctx.body = {};
                }
                resolve();
            });
        });
        await next();
    }
}
