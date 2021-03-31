import http from 'http';
import fs from 'fs';
import zlib from 'zlib';
import { resolve } from 'path';
const file1 = resolve(__dirname, '../public/gzip.txt');
const file2 = resolve(__dirname, '../public/gzip.gz');
const file3 = resolve(__dirname, '../public/gzip.html')

export function demo() {
    const gzip = zlib.createGzip();
    fs.createReadStream(file1).pipe(gzip).pipe(fs.createWriteStream(file2));
}
// demo();


const server = http.createServer((req, res) => {
    const encoding = req.headers['accept-encoding'];
    if (encoding) {
        if (/\bgzip\b/.test(encoding as string)) {
            // NOTE: 不设置header，浏览器会当作gz文件下载
            res.setHeader('Content-Encoding', 'gzip');
            fs.createReadStream(file3).pipe(zlib.createGzip()).pipe(res);
            return;
        }
        if (/\bdeflate\b/.test(encoding as string)) {
            res.setHeader('Content-Encoding', 'deflate');
            fs.createReadStream(file3).pipe(zlib.createDeflate()).pipe(res);
            return;
        }
    } else {
        fs.createReadStream(file3).pipe(res);
    }
});

server.listen(3000, () => {
    console.log('http://localhost:3000');
});
