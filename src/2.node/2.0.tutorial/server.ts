import http from 'http';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    console.log(req);
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
    // 可以访问 HTTP 请求头
    req.on('data', chunk => {
        console.log(`可用的数据块: ${chunk}`);
    });
    req.on('end', () => {
        // 数据结束
    })
});
server.listen(port, hostname, () => {
    console.log(`服务器运行在 http://${hostname}:${port}/`);
})
