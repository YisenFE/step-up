// http://nodejs.cn/api/fs.html#fs_fs_createreadstream_path_options

import fs from 'fs';
import {EventEmitter} from 'events';
import { _path } from '../../utils/path';

const file1 = 'name-stream.txt';
const file2 = 'name-stream1.txt';

export namespace _ {
    // 文件操作读和些 流：可读流 可写流（fs.read fs.write）异步读写
    // 我们希望不会占用大量内存
    const rs = fs.createReadStream(_path(file1), {
        flags: 'r', // 打开文件 r w r+ w+ a...
        highWaterMark: 2, // 每次读取一个 字节数 默认每次读取64K文件内容
        mode: 0o666, // 可读可写
        start: 0, // 开始读取的位置
        end: 5, // 结束读取的位置
        // encoding: 'utf8',
        autoClose: true
    });

    // console.log(rs);


    /**
     * 读文件
     */
    export function demo1() {
        rs.on('error', (err) => {
            console.log(err);
        });

        rs.on('open', () => {
            console.log('文件打开了');
        }); // rs 是内部 new ReadStream 的实例

        let arr: Buffer[] = [];
        rs.on('data', (chunk: Buffer) => {
            console.log(chunk);
            arr.push(chunk);
        });

        rs.on('end', () => {
            const str = Buffer.concat(arr).toString();
            console.log('读取完毕:', str);
        })

        rs.on('close', () => {
            console.log('close');
        });
    }

    /**
     * 打开文件读一次后暂停读取，1s后恢复读取
     */
    export function demo2() {
        rs.on('error', (err) => {
            console.log(err);
        });

        rs.on('open', () => {
            console.log('文件打开了');
        }); // rs 是内部 new ReadStream 的实例

        let arr: Buffer[] = [];
        rs.on('data', (chunk: Buffer) => {
            console.log(chunk);
            arr.push(chunk);
            rs.pause(); // 停止data事件的触发，并切换出流动模式。 任何可用的数据都会保留在内部缓存中。
        });

        setInterval(() => { // 读一秒存一秒
            rs.resume(); // 恢复
        }, 1000);

        rs.on('end', () => {
            const str = Buffer.concat(arr).toString();
            console.log('读取完毕:', str);
        });

        rs.on('close', () => {
            console.log('close');
        });
    }
}

export namespace __ {
    type ReadStreamOptions = string | {
        flags?: string;
        encoding?: BufferEncoding;
        fd?: number;
        mode?: number;
        autoClose?: boolean;
        /**
         * @default false
         */
        emitClose?: boolean;
        start?: number;
        end?: number;
        highWaterMark?: number;
    };
    class ReadStream extends EventEmitter {
        public path: fs.PathLike;

        public flags: string; // http://nodejs.cn/api/fs.html#fs_file_system_flags
        public encoding?: BufferEncoding;
        public fd?: number;
        public mode: number;
        public autoClose: boolean;
        public emitClose?: boolean;
        public start: number;
        public end?: number;
        public highWaterMark: number;
        // 默认为非流动模式 rs.pause rs.resume
        public flowing = false; // 开始读取的时候 需要把这个值改成true
        public pos: number;

        constructor(path: fs.PathLike, options: ReadStreamOptions) {
            super();
            this.path = path;
            if (typeof options === 'string') {
                options = {encoding: options as BufferEncoding};
            }
            this.flags = options.flags || 'r';
            this.encoding = options.encoding;
            this.fd = options.fd;
            this.mode = options.mode || 438;
            this.autoClose = options.autoClose || true;
            this.emitClose = options.emitClose;
            this.start = options.start || 0;
            this.end = options.end;
            this.highWaterMark = options.highWaterMark || 64 * 1024;

            this.pos = this.start;

            this.open();

            this.on('newListener', (type) => {
                if (type === 'data') {
                    this.flowing = true; // 开始读取
                    this.read();
                }
            });
        }
        public open() {
            fs.open(this.path, this.flags, (err, fd) => {
                if (err) {
                    this.emit('error');
                    return;
                }
                this.fd = fd;
                this.emit('open', this.fd);
            });
        }
        public read() {
            // 默认第一次 read方法 肯定拿不到 fd 的 但是等一会而过触发了 open 事件，肯定可以获取到 this.fd
            if (typeof this.fd !== 'number') { // 抱枕文件描述符存在的时候 才调用 read 方法来读取
                this.once('open', () => this.read());
            } else {
                let toRead = this.end
                    ? Math.min((this.end - this.pos + 1), this.highWaterMark)
                    : this.highWaterMark;
                const buffer = Buffer.alloc(toRead);
                fs.read(this.fd, buffer, 0, buffer.length, this.pos, (err, bytesRead) => {
                    if (!bytesRead) {
                        this.emit('end');
                        if (this.emitClose) this.emit('close');
                        return;
                    }
                    this.pos += bytesRead;
                    this.emit('data', this.encoding ? buffer.toString(this.encoding) : buffer);
                    if (this.flowing) {
                        this.read();
                    }
                });
            }
        }
        public pause() {
            this.flowing = false;
        }
        public resume() {
            this.flowing = true;
            this.read();
        }
        pipe(ws: fs.WriteStream) {
            this.on('data', chunk => !ws.write(chunk) && this.pause());

            ws.on('drain', () => this.resume());
        }
    }
    export function fn() {
        const rs = new ReadStream(_path(file2), {
            flags: 'r',
            highWaterMark: 3,
            mode: 0o666,
            start: 0,
            end: 20,
            emitClose: true
        });

        rs.on('error', (err) => {
            console.log(err);
        });

        rs.on('open', () => {
            console.log('文件打开了11');
        });

        let arr: Buffer[] = [];
        rs.on('data', (chunk: Buffer) => {
            console.log(chunk);
            arr.push(chunk);
        });

        rs.on('end', () => {
            const str = Buffer.concat(arr).toString();
            console.log('读取完毕:', str);
        })

        rs.on('close', () => {
            console.log('close');
        });
    }
}

// _.demo1();
// _.demo2();
// __.fn();
