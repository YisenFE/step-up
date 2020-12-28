/**
 * @file promise原型方法
 */
import { Promise } from './promise';

import fs from 'fs';
import { _path } from '../../../utils/path';

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
    // read(_path('name.txt')).then((data: string) => {
    //     console.log(data);
    // });
}

module promise32_1 {
    // const p = new Promise((resolve, reject) => {
    //     // reject('同步catch');
    //     console.log('init')
    //     setTimeout(() => {
    //         reject('异步catch');
    //     }, 10000);
    // });

    // p.catch(err => {
    //     console.log(err);
    //     throw new Error('错了');
    // }).finally(() => {
    //     console.log('finally无论状态成功或失败，都执行');
    // }).then(res => {
    //     console.log(res);
    // });

    // p.catch(err => {
    //     console.log(err);
    //     throw new Error('错了');
    // });
    // console.log(123)

    // const p1 = new Promise<string>((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve('p1');
    //     });
    // });
    // const p2 = new Promise<number>((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(2);
    //     }, 100);
    // });

    // const p3 = () => { };
    // const p4 = 4;
    // const p5 = 'p5';
    // const p6 = new Promise<number>((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(6);
    //     }, 10000);
    // });

    // Promise.all([p1, p2, p3, p4, p5, p6]).then(res => {
    //     console.log(res);
    // });
    // Promise.race([p1, p2, p3, p4, p5, p6]).then((value) => {
    //     console.log(value);
    // });


    //     Promise.resolve(p6).then(a => {
    //         console.log(a)
    //     });
}
