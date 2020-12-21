/**
 * @file promise使用介绍
 */
/// <reference path="../types/node.d.ts"/>
import {
    _,
    Promise_Sync,
    Promise_Async,
} from './2.implement';

import fs from 'fs';
import path from 'path';

const _path = (p: string): string => {
    return path.resolve(__dirname, p);

};

module promise31_sync {
    console.log('---------- sync ----------')
    const p = new Promise_Sync<string>((resolve, reject) => {
        /* 1 */
        // resolve('玩具少');
        // reject('玩具多');

        /* 2 */
        // throw new Error('报错');
    });
    p.then(val => {
        console.log(val, 'success');
        return val;
    }, err => {
        console.log(err, 'fail');
    });
    p.then(val => {
        console.log(val, 'success');
    }, err => {
        console.log(err, 'fail');
    });
}

module promise31_async1 {
    console.log('---------- async1 ----------')
    const p = new Promise_Async<string>((resolve, reject) => {
        setTimeout(() => {
            /* 1 */
            // resolve('成功');

            /* 2 */
            // reject('失败');
        }, 1000);
    });
    p.then(val => {
        console.log(val, 'success');
    }, err => {
        console.log(err, 'fail');
    });
    p.then(val => {
        console.log(val, 'success');
    }, err => {
        console.log(err, 'fail');
    });
    p.then(val => {
        console.log(val, 'success');
    }, err => {
        console.log(err, 'fail');
    });
}

module promise31_async2 {
    console.log('---------- async2 ----------');
    read(_path('../name.txt')).then(data => {
        /* 1 */
        // console.log(data)
        read(_path(data))

        /* 2 */
    }).then(data => {
        console.log(data);
    })


    function read(url: string) {
        return new Promise_Async<string>((resolve, reject) => {
            fs.readFile(url, 'utf8', (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
    }
}

console.log('你好')
