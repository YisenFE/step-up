import fs from 'fs';
import { _path } from '../../../utils/path';
import { Promise } from './promise';

namespace _ {
    export function promisify(fn: Function) {
        return (...args: any[]) => {
            return new Promise((resolve, reject) => {
                fn(...args, (err: any, data: any) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
        }
    }

    let read = promisify(fs.readFile);
    let write = promisify(fs.writeFile);
    write(_path('write.txt'), 123).then(data => {
        console.log('[SUCCESS]write')
    });
}

module promise33_1 {
    function promisifyAll(obj: {[key: string]: any}) {
        for (let key in obj) {
            obj[key+'Async'] = _.promisify(obj[key]);
        }
    }
    promisifyAll(fs);
    ((fs as any).readFileAsync(_path('name.txt'), 'utf8') as any).then((data: string) => {
        console.log(data);
    });

}
