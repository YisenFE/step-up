import fs from 'fs';
import { EventEmitter } from 'events';
import { _path } from '../../utils/path';


const file1 = 'name-stream2.txt';

namespace _ {
    const ws = fs.createWriteStream(_path(file1), {
        flags: 'w',
        mode: 0o666,
        autoClose: true,
        encoding: 'utf8',
        highWaterMark: 2 // 预期使用内存
    });
    export function demo1() {
        let i = 9;
        function write() {
            let flag = true;
            while (i && flag) {
                flag = ws.write(i-- + '');
            }
        }
        write();
        ws.on('drain', () => {
            console.log('drain');
            write();
        });
    }
}

namespace __ {
    type WriteStreamOptions = string | {
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
        highWaterMark?: number;
    };
    class WriteStream extends EventEmitter {
        public path: fs.PathLike;

        public flags: string;
        public encoding?: BufferEncoding;
        public fd?: number;
        public mode: number;
        public autoClose: boolean;
        public emitClose?: boolean;
        public start: number;
        public highWaterMark: number;

        public cache: any[];
        public len: number;
        public needDrain: boolean;
        public writing: boolean = false;
        public pos: number;
        constructor(path: string, options: WriteStreamOptions) {
            super();
            this.path = path;
            if (typeof options === 'string') {
                options = {encoding: options as BufferEncoding};
            }
            this.flags = options.flags || 'r';
            this.encoding = options.encoding;
            this.fd = options.fd;
            this.mode = options.mode || 0o666;
            this.autoClose = options.autoClose || true;
            this.emitClose = options.emitClose;
            this.start = options.start || 0;
            this.highWaterMark = options.highWaterMark || 16 * 1024;

            this.open();

            this.cache = []; // 缓存多次写入的数据

            this.len = 0;
            this.needDrain = false;
            this.pos = this.start;

        }
        open() {
            fs.open(this.path, this.flags, (err, fd) => {
                if (err) {
                    return this.emit('error');
                }
                this.fd = fd;
                this.emit('open');
            });
        }
        write(chunk: any, encoding?: BufferEncoding, callback: Function = () => {}) {
            if (this.encoding) encoding = this.encoding;
            chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            this.len += chunk.length;
            if (this.len >= this.highWaterMark) {
                this.needDrain = true;
            }
            if (this.writing) {
                this.cache.push({
                    chunk,
                    encoding,
                    callback
                });
            } else {
                this.writing = true;
                this._write(chunk, encoding!, () => {
                    callback();
                    this.clearBuffer();
                });
            }

            return !this.needDrain;
        }
        _write(chunk: any, encoding: BufferEncoding, callback: Function = () => {}) {
            if (typeof this.fd !== 'number') {
                this.once('open', () => this._write(chunk, encoding, callback));
            } else {
                fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, written) => {
                    this.pos += written;
                    this.len -= written;
                    callback();
                });
            }
        }
        clearBuffer() {
            let obj = this.cache.shift();
            if (obj) {
                this._write(obj.chunk, obj.encoding, () => {
                    obj.callback();
                    this.clearBuffer();
                })
            } else {
                if (this.needDrain) {
                    this.needDrain = false;
                    this.writing = false;
                    this.emit('drain');
                }
            }
        }
    }

    const ws = new WriteStream(_path(file1), {
        flags: 'w',
        mode: 0o666,
        autoClose: true,
        encoding: 'utf8',
        highWaterMark: 2 // 预期使用内存
    });
    export function demo2() {
        let i = 9;
        function write() {
            let flag = true;
            while (i && flag) {
                flag = ws.write(i-- + '');
            }
        }
        write();
        ws.on('drain', () => {
            console.log('drain');
            write();
        });
    }
}
// _.demo1();
// __.demo2();
