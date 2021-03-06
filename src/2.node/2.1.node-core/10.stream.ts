// http://nodejs.cn/api/stream.html
import fs from 'fs';
import { Duplex, Writable } from 'stream';
import { _path } from '../../utils/path';

const file1 = 'stream1.txt';

namespace _ {
    export function fn1() {
        class MyWriteStream extends Writable {
            _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) { // 子类实现 可写流方法
                console.log(chunk);
                fs.appendFile(_path(file1), chunk, () => {
                    setTimeout(() => {
                        callback();
                    });
                });
                // callback();
            }
        }
        const ws = new MyWriteStream();
        ws.write('1'); // 1) 真的写入文件，之后放到队列里
        ws.write('2');
    }

    export function fn2() {
        class MyDuplex extends Duplex {
            _read() {
                console.log('read');
            }
            _write() {

            }
        }
        const md = new MyDuplex();
        md.on('data', () => {

        });
        md.write('1');
    }
}

// _.fn1();
_.fn2();

