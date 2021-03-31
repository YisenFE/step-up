import http from 'http';
import fs from 'fs';
import url from 'url';
import path from 'path';

http.createServer((req, res) => {
    const { pathname } = url.parse(req.url || '');
    const absPath = path.join(__dirname, pathname || '');
    console.log(req.method, req.headers);

    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie');
    res.setHeader('Access-Control-Max-Age', 1000); // 默认每次都发options，可以限制发送的频率
    if (req.method === 'OPTIONS') {
        res.setHeader('Set-Cookie', 'id=123');
        return res.end();
    }
    if (pathname === '/user') {
        console.log(2324);
        return res.end(JSON.stringify({ name: 'yisen' }));
    }

    fs.stat(absPath, (err, stats) => {
        if (err) {
            res.statusCode = 404;
            res.end(err.toString());
            return;
        }
        if (stats.isDirectory()) {
            res.end('directory');
        } else {
            fs.createReadStream(absPath).pipe(res);
        }
    });
}).listen(3000, () => {
    console.log('http://localhost:3000');
});
