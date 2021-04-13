import Koa from 'koa';
import mime from 'mime';
import fs from 'fs/promises';
import { join } from 'path';
import { createReadStream } from 'fs';

export default function _serve(dir: string) {
    return async(ctx: Koa.ParameterizedContext, next: Koa.Next) => {
        try {
            const reqUrl = ctx.path;
            let absPath = join(dir, reqUrl);
            console.log(absPath);
            const stats = await fs.stat(absPath);
            if (stats.isDirectory()) {
                absPath = join(absPath, 'index.html');
            }
            ctx.set('Content-type', mime.getType(absPath) + ';charset=utf8');
            ctx.body = createReadStream(absPath);
        } catch (error) {
            await next();
        }
    }
}

const app = new Koa();
const port = 3000;
// listener();
function listener() {
    app.use(async (ctx, next) => {
        console.log(ctx.path);
        if (ctx.path === '/1.form.html') {
            ctx.set('Content-Type', 'text/html');
            ctx.body = createReadStream('./public/1.form.html');
        } else {
            await next();
        }
    });
    app.listen(port);
}
