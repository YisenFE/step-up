import http from 'http';

const server = http.createServer((req, res) => {
    const core = req.headers['user-agent'];
    console.log(core);
    if (core?.includes('Android')) {
        res.statusCode = 302;
        res.setHeader('Location', 'https:www.baidu.com');
        res.end(); // 重定向
    } else {
        res.statusCode = 302;
        res.setHeader('Location', 'https://github.com/YisenFE/step-up');
        res.end(); // 重定向
    }
});

server.listen(3000, () => {
    console.log('http://localhost:3000');
});

//# npm run dev:3
//# curl -v http://localhost:3000
//# curl -v --header "User-Agent:Android" http://localhost:3000
