/**
 * fs
 */
import fs from 'fs';
import { _path } from '../../utils/path';

namespace _ {
    function fn() {
        fs.readFile(_path('name.txt'), { encoding: 'utf8' }, (err, data) => {
            if (err) throw err;
            fs.writeFile(_path('/write.txt'), data, (err) => {
                if (err) throw err;
            });
        });
    }
    // fn();
}
// 针对大文件上述方法不可行，（全部读完，再全部写入）

namespace _1 {
    function fn() {
        const buffer = Buffer.alloc(3);
        fs.open(_path('fs.txt'), 'r', (err, fd) => {
            // fd: file descriptor 文件描述符
            if (err) throw err;
            console.log(fd);
            fs.read(fd, buffer, 0, 3, 0, (err, bytesRead, buffer) => {
                if (err) throw err;
                console.log(bytesRead, buffer.toString());
            });
        });
    }
    // fn();
}

namespace _2 {
    function fn() {
        const buffer = Buffer.from('义森');
        fs.open(_path('fs.txt'), 'r+', (err, fd) => {
            if (err) throw err;
            fs.write(fd, buffer, 0, buffer.length, 10, (err, written, buffer) => {
                if (err) throw err;
                console.log(written, buffer);
            });
        });
    }
    // fn();
}

namespace _3 {
    function copy(source: string, target: string) {
        const bufferAlloc = Buffer.alloc(3);
        fs.open(source, 'r', (err, rfd) => {
            fs.open(target, 'w', (err, wfd) => {
                function next() {
                    fs.read(rfd, bufferAlloc, 0, bufferAlloc.length, null, (err, bytesRead, buffer) => {
                        if (err) throw err;
                        if (bytesRead > 0) {
                            fs.write(wfd, buffer, 0, bytesRead, (err) => {
                                if (err) throw err;
                                next();
                            });
                        } else {
                            fs.close(rfd, () => {});
                            fs.close(wfd, () => {});
                        }
                    });
                }
                next();
            });
        });
    }
    // copy(_path('fs.txt'), _path('fs1.txt'));
}
