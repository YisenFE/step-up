/// <reference path="../../../types/error.d.ts" />

import http from 'http';
import url from 'url';
import path from 'path';
import fs from 'fs';

const options = {
    host: '127.0.0.1',
    port: 4000
};

const server = http.createServer((req, res) => {
    if (req.url) {
        const { pathname } = url.parse(req.url, true);
        const absPath = path.join(__dirname, pathname as string);
        fs.stat(absPath, (err, stats) => {
            if (err) resHandler(res, 500);
            if (!stats) resHandler(res, 404);
            if (stats.isFile()) {
                fs.createReadStream(absPath).pipe(res);
            } else if (stats.isDirectory()) {
                resHandler(res, 404);
            } else {
                console.log(req)
                res.statusCode = 404;
                res.end();
            }
        });
    } else {
        console.log(req)
        res.statusCode = 404;
        res.end();
    }
});
server.listen(options, () => {
    const { host, port } = options;
    console.log(`server start: http://${host}:${port}`);
});

server.on('error', (err: NodeError) => {
    if (err.code === 'EADDRINUSE') {
        server.listen(options.port += 1);
    }
});


function resHandler(res: http.ServerResponse, statusCode: number) {
    res.statusCode = statusCode;
    switch (statusCode) {
        case 404:
            res.end('file not found');
            break;
        case 500:
            res.end('service fail');
            break;
    }
}

// http://0.0.0.0:4000/3.js
// http://0.0.0.0:4000/3.html



// 使用async await 优化


