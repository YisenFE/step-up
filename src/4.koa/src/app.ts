import { resolve } from 'path';
import Koa from 'koa';
import _serve from './_static';
import serve from 'koa-static';
import { _bodyParser } from './_bodyParser';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const port = 3000;
console.log(port, 'port')

// app.use(_serve(resolve(__dirname, '../')));
app.use(serve(resolve(__dirname, '../')));
// app.use(_bodyParser());
app.use(bodyParser());
app.use(async (ctx, next) => {
    if (ctx.path === '/submit' || ctx.path === '/upload' && ctx.method === 'POST') {
        ctx.body = ctx.request.body;
    } else {
        await next();
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

