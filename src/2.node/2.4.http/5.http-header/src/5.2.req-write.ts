import http from 'http';
import fs from 'fs';
import path from 'path';
// 分片上传
let start = 0; // 默认从0开始，每次下载5个 保存到一个新的文件中 download.txt

const ws = fs.createWriteStream(path.resolve(__dirname, '../public/range-write.txt'));

let mode = 'start';
process.stdin.on('data', chunk => {
    if (chunk.toString().includes('pause')) {
        mode = 'pause';
        console.log('终止写入');
    } else {
        mode = 'start';
        console.log('开始写入');
        download();

    }
});


function download() {
    http.get({
        hostname: 'localhost',
        port: 3000,
        headers: {
            Range: `bytes=${start}-${start + 5}`
        }
    }, (res) => {
        res.on('data', (chunk) => {
            ws.write(chunk);

            const ContentRange = res.headers['content-range'] || '';
            let total = Number(ContentRange.split('/')[1]);
            if (start <= total) {
                start += 5;
                setTimeout(() => {
                    if (mode === 'start') {
                        download();
                    }
                }, 1000);
            } else {
                ws.end();
            }
        });
    });
}

download();

//# npm run dev:2
//# ts-node src/5.2.req-write.ts
