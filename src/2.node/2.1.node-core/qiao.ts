import fs from 'fs';
import path from 'path';

namespace _ {
    function mkdirSync(paths: string) {
        const arr = paths.split('/');
        for (let i = 0; i < arr.length; i++) {
            const currPath = path.resolve(__dirname, arr[i]);
            try {
                fs.accessSync(currPath);
            } catch (error) {
                fs.mkdirSync(currPath);
            }
        }
    }

    // mkdirSync('a/b/c');

    function mkdir(paths: string) {
        const arr = paths.split('/');
        next();
        function next(index: number = 0) {
            if (index >= arr.length) return;
            const currPath = arr[index];
            fs.access(currPath, (err) => {
                if (err) {
                    fs.mkdir(currPath, () => next(index + 1));
                } else {
                    next(index + 1);
                }
            });
        }
    }

    // mkdir('a/b/c');

    function deepRemoveDirSync(dir: string) {
        const stats = fs.statSync(dir);
        if (stats.isDirectory()) {
            const subDirs = fs.readdirSync(dir);
            subDirs.forEach(d => {
                const subDir = path.join(dir, d);
                deepRemoveDirSync(subDir);
            });
            fs.rmdirSync(dir);
        } else {
            fs.unlinkSync(dir);
        }
    }
}
