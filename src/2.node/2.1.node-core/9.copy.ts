import fs from 'fs';
import { _path } from '../../utils/path';

const file1 = 'copy1.txt';
const file2 = 'copy2.txt';

const rs = fs.createReadStream(_path(file1), {highWaterMark: 4});
const ws = fs.createWriteStream(_path(file2), {highWaterMark: 5});
// const ws = fs.createWriteStream(_path(file2), {highWaterMark: 1});

// rs.pipe(ws); // 通过pipe可以实现拷贝

rs.on('data', (chunk) => {
    console.log(chunk.toString());
    const flag = ws.write(chunk);
    if (!flag) {
        rs.pause();
    }
});

ws.on('drain', () => {
    console.log('drain');
    rs.resume();
});
