/**
 * @file generator
 */

import { resolve } from 'path';
import { _path } from '../../utils/path';

namespace _ {
    const obj: {
        [key: string]: any,
        [Symbol.iterator](): Iterator<any>
    } = {
        0: 1,
        1: 2,
        2: 3,
        length: 3,
        [Symbol.iterator]() {
            let index = 0;
            return {
                next: () => {
                    return {
                        value: this[index++],
                        done: index > this.length
                    }
                }
            }
        }
    };
    function fn() {
        const arr = [...obj];
        console.log(arr);
    }
    fn();
}

namespace _1 {
    export const obj: {
        [key: string]: any,
        [Symbol.iterator](): Iterator<any>
    } = {
        0: 1,
        1: 2,
        2: 3,
        length: 3,
        [Symbol.iterator]: function *() {
            let index = 0;
            while (index !== this.length) {
                yield this[index++];
            }
        }
    };
    export function fn() {
        const arr = [...obj];
        console.log(arr);
    }
    fn();
}

namespace _2 {
    function fn() {
        function* read() {
            let a = yield 1;
            console.log(a, 'a');
            let b = yield 2;
            console.log(b, 'b');
            let c = yield 3;
            console.log(c, 'c');
        }
        let it = read();
        console.log(it);
        console.log(it.next());
        console.log(it.next(100));
        console.log(it.next(200));
        console.log(it.next(300));
    }
    fn();
}

namespace _3 {
    function fn() {
        const fs = require('mz/fs');
        function * read() {
            const r = yield fs.readFile(_path('name.txt'), 'utf8');
            const age = yield fs.readFile(_path(r), 'utf8');
            yield 1 + age;
        }
        const it = read();
        const { value, done } = it.next();
        Promise.resolve(value).then((data: string) => {
            const { value, done } = it.next(data);
            Promise.resolve(value).then((data: string) => {
                const { value, done } = it.next(data);
                Promise.resolve(value).then(data => {
                    console.log(data);
                });
            });
        });
    }
    fn();
}

namespace _4 {
    function fn() {
        const fs = require('mz/fs');
        // const co = require('co');
        function co(it: Generator): Promise<any> {
            return new Promise((resove, reject) => {
                next();
                function next(val?: any) {
                    const { value, done } = it.next(val);
                    if (done) return resolve(value);
                    Promise.resolve(value).then(data => {
                        next(data);
                    }, reject);
                }
            });
        }

        function * read() {
            const r = yield fs.readFile(_path('name.txt'), 'utf8');
            const age = yield fs.readFile(_path(r), 'utf8');
            const result = yield [1 + age];
            return result
        }
        co(read()).then((data: string) => {
            console.log(data);
        }).catch((err: any) => {
            console.log(err);
        });
    }
    fn();
}
