import fs from 'fs';
import path from 'path';

/** 同步递归创建文件夹 */
namespace _ {
    function mkdirSync(paths: string) {
        const arr = paths.split('/');
        for (let i = 0; i < arr.length; i++) {
            const currPath = path.resolve(__dirname, arr.slice(0, i + 1).join('/'));
            try {
                fs.accessSync(currPath);
            } catch (error) {
                fs.mkdirSync(currPath);
            }
        }
    }
    mkdirSync('a/b/c/d/e');
}

/** 异步递归创建文件夹 */
namespace _1 {
    function mkdir(paths: string) {
        const arr = paths.split('/');
        function next(index: number) {
            if (index >= arr.length) return;
            const currPath = path.resolve(__dirname, arr.slice(0, index + 1).join('/'));
            fs.access(currPath, (err) => {
                if (err) {
                    fs.mkdir(currPath, () => next(index + 1));
                } else {
                    next(index + 1);
                }
            })
        }
        next(0);
    }
    mkdir('a/b/c/d/e/f/g');
    mkdir('a/b1/b1/d1/e1');

    mkdir('a1/b1/c1/d1');
    mkdir('a1/b2/b2/d2/e3');
}

/** 同步递归删除 */
namespace _2 {
    // 删除目录 rmdirSync 删除文件 unlinkSync
    // fs.stat 文件的状态 stats.isDirectory()
    // 深度遍历
    function deepRemoveDirSync(dir: string) {
        const stats = fs.statSync(dir);
        if (stats.isDirectory()) {
            let subDirs = fs.readdirSync(dir);
            subDirs.forEach(d => {
                const subDir = path.join(dir, d);
                deepRemoveDirSync(subDir);
            });
            fs.rmdirSync(dir);
        } else {
            fs.unlinkSync(dir);
        }
    }
    deepRemoveDirSync(path.resolve(__dirname, 'a1'));
    fs.rmdirSync(path.resolve(__dirname, 'a1'), {recursive: true});

    // 广度遍历
    function wideRemoveDirSync(dir: string) {
        let arr = [dir];
        let index = 0;
        let currPath: string;
        while (currPath = arr[index++]) {
            const stats = fs.statSync(currPath);
            if (stats.isDirectory()) {
                const subDirs = fs.readdirSync(currPath).map(d => path.join(currPath, d));
                arr = [...arr, ...subDirs];
            }
        }
        for (let i = arr.length - 1; i >= 0; i--) {
            const stats = fs.statSync(arr[i]);
            if (stats.isDirectory()) {
                fs.rmdirSync(arr[i]);
            } else {
                fs.unlinkSync(arr[i]);
            }
        }
    }
    wideRemoveDirSync(path.resolve(__dirname, 'a1'));
}

/** 异步递归删除 */
namespace _2 {
    function rmdir(dir: string, callback: fs.NoParamCallback) {
        fs.stat(dir, (err, stats) => {
            if (stats.isDirectory()) {
                fs.readdir(dir, (err, subDirs) => {
                    subDirs = subDirs.map(d => path.join(dir, d));
                    next(0);
                    function next(index: number) {
                        if (index === subDirs.length) return fs.rmdir(dir, callback);
                        rmdir(subDirs[index], () => next(index + 1));
                    }
                });
            } else {
                fs.unlink(dir, callback);
            }
        });
    }

    rmdir(path.resolve(__dirname, 'a1'), () => { console.log('remove success'); });
}

/** 异步 并发 删除 */
namespace _3 {
    function rmdirParalle(dir: string, callback: fs.NoParamCallback) {
        fs.stat(dir, (err, stats) => {
            if (stats.isDirectory()) {
                fs.readdir(dir, (err, subDirs) => {
                    if (subDirs.length === 0) {
                        return fs.rmdir(dir, callback);
                    }
                    subDirs = subDirs.map(p => {
                        const currPath = path.join(dir, p);
                        rmdirParalle(currPath, done);
                        return currPath;
                    });

                    // 并发删除
                    let index = 0;
                    function done() {
                        if (++index === subDirs.length) {
                            fs.rmdir(dir, callback);
                        }
                    }
                });
            } else {
                fs.unlink(dir, callback);
            }
        });
    }
    rmdirParalle('a', () => { console.log('rmove success'); });
}


