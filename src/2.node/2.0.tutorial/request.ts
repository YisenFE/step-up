import http from 'http';

export function fn1() {

    const options = {
        hostname: '127.0.0.1',
        port: 3000,
        path: '/',
        method: 'GET'
    };

    const req = http.request(options, res => {
        console.log(`状态码：${res.statusCode}`);
        res.on('data', d => {
            process.stdout.write(d);
        })
    });
    req.on('error', error => {
        console.log(error);
    });
    req.end();
}
// fn1();

export function fn2() {
    const data = JSON.stringify({
        todo: '做点事情'
    });
    const options = {
        hostname: '127.0.0.1',
        port: 3000,
        path: '/',
        methods: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };
    const req = http.request(options, res => {
        console.log(`状态码: ${res.statusCode}`);
        res.on('data', d => {
            process.stdout.write(d);
        });
    });
    req.on('error', error => {
        console.error(error);
    });
    req.write(data);
    req.end();
}
fn2();
