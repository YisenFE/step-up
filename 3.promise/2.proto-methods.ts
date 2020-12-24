/**
 * @file promise原型方法
 */
/// <reference path="../types/node.d.ts"/>
import { Promise } from './promise';

import fs from 'fs';
import path, { resolve } from 'path';

const _path = (p: string): string => path.resolve(__dirname, p);

/** 延迟对象 */
module promise32_0 {
    // function read(url: string) {
    //     const defer = (Promise as any).deferred();
    //     fs.readFile(url, 'utf8', (err, data) => {
    //         if (err) return defer.reject(err);
    //         defer.resolve(data);
    //     });
    //     return defer.promise;
    // }
    // read(_path('../name.txt')).then((data: string) => {
    //     console.log(data);
    // });
}

module promise32_1 {
    const p = new Promise((resolve, reject) => {
        // reject('同步catch');
        console.log('init')
        setTimeout(() => {
            reject('异步catch');
        }, 10000);
    });

    p.catch(err => {
        console.log(err);
        throw new Error('错了');
    }).finally(() => {
        console.log('finally无论状态成功或失败，都执行');
    }).then(res => {
        console.log(res);
    });

    // p.catch(err => {
    //     console.log(err);
    //     throw new Error('错了');
    // });
    // console.log(123)
}
