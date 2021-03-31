// https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Range
//# curl -v --header "Range:bytes=0-5" 网址

import http, { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

const DOWNLOAD_FILE = path.resolve(__dirname, '../public/range.txt');
const TOTAL = fs.statSync(DOWNLOAD_FILE).size;
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-type', 'text/plain;charset=utf8');
    const RANGE: string | undefined = req.headers['range'];
    console.log(RANGE);
    if (RANGE) { // Range:bytes=1-5
        const [, START, END] = RANGE.match(/(\d*)-(\d*)/) || [];

        const start = START ? Number(START) : 0;
        const end = END ? Number(END) - 1 : TOTAL;

        res.statusCode = 206; // 范围请求
        res.setHeader('Content-Range', `bytes ${start}-${end}/${TOTAL}`);
        fs.createReadStream(DOWNLOAD_FILE, { start, end }).pipe(res);
    } else {
        fs.createReadStream(DOWNLOAD_FILE).pipe(res);
    }
});

server.listen(3000, () => {
    console.log('http://localhost:3000');
});

//# npm run dev:2
//# curl -v --header "Range:bytes=0-5" http://localhost:3000
//# curl -v http://localhost:3000
