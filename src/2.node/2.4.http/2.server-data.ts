/// <reference path="../../../types/error.d.ts" />
import http from 'http';
import querystring from 'querystring';

const options = {
    host: '0.0.0.0',
    port: 3000
};

const server = http.createServer();

server.listen(options, () => {
    const { host, port } = options;
    console.log(`server start: http://${host}:${port}`);
});

server.on('error', (err: NodeError) => {
    if (err.code === 'EADDRINUSE') {
        server.listen(options.port += 1);
    }
});
server.on('request', (req, res) => {
    console.log('请求来了');
    // console.log(req);
    // console.log(res);

    let arr: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
        arr.push(chunk);
    });
    req.on('end', () => {
        const str = Buffer.concat(arr).toString();
        console.log(req);
        res.statusCode = 200;
        res.setHeader('a', 1);
        if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            const resData = querystring.parse(str);
            res.end(JSON.stringify(resData));
            return;
        }

        res.end('welcome');

    });
});

//# curl -v -X POST --data "data=xxx" 0.0.0.0:3000

// 浏览器打开2.html 输入表单，提交
