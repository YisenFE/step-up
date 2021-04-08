/**
 * express 大 功能全 集成路由的功能，还集成了内置方法
 * koa 小 + 插件
 * egg 基于 koa
 */
import  express, {Request, Response} from 'express';
const app = express();
const port = 3000;

namespace _ {
    function fn1() {
        app.get('/', (req, res) => {
            res.send('get: Hello World!');
        });

        app.post('/', (req, res) => {
            res.send('post: Hello World!');
        });

        app.all('/', (req, res) => {
            res.send('all: Hello World!');
        });

        app.all('*', (req, res) => {
            res.end('all *');
        });

        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    }
    // fn1();
}

namespace _1 {
    function fn2() {
        app.get('/users/:userId/books/:bookId', (req, res) => {
            res.send(req.params);
        });
        app.listen(port, () => {
            console.log(
                `Example app listening at http://localhost:${port}`
                + `\n   demo: http://localhost:${port}/users/34/books/8989`
            );
        });
    }
    fn2();
}
