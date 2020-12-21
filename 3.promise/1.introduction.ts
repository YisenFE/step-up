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
import path, { resolve } from 'path';

const _path = (p: string): string => {
    return path.resolve(__dirname, p);

};

// module promise31_sync {
//     const p = new Promise_Sync<string>((resolve, reject) => {
//         /* 1 */
//         // resolve('玩具少');
//         // reject('玩具多');

//         /* 2 */
//         // throw new Error('报错');
//     });
//     p.then(val => {
//         console.log(val, 'success');
//         return val;
//     }, err => {
//         console.log(err, 'fail');
//     });
//     p.then(val => {
//         console.log(val, 'success');
//     }, err => {
//         console.log(err, 'fail');
//     });
// }

// module promise31_async1 {
//     const p = new Promise_Async<string>((resolve, reject) => {
//         setTimeout(() => {
//             /* 1 */
//             // resolve('成功');

//             /* 2 */
//             // reject('失败');
//         }, 1000);
//     });
//     p.then(val => {
//         console.log(val, 'success');
//     }, err => {
//         console.log(err, 'fail');
//     });
//     p.then(val => {
//         console.log(val, 'success');
//     }, err => {
//         console.log(err, 'fail');
//     });
//     p.then(val => {
//         console.log(val, 'success');
//     }, err => {
//         console.log(err, 'fail');
//     });
// }

// module promise31_async2 {
//     read(_path('../name.txt')).then(data => {
//         return read(_path(data))
//     }).then(data => {
//         console.log(data);
//     })


//     function read(url: string) {
//         return new Promise_Async<string>((resolve, reject) => {
//             fs.readFile(url, 'utf8', (err, data) => {
//                 if (err) return reject(err);
//                 resolve(data);
//             });
//         });
//     }
// }

// module promise31_async3 {
//     const p = new Promise_Async<number>((resolve, reject) => {
//         resolve(123)
//     });

//     const p2 = p.then(data => {
//         throw new Error('123');
//     }, err => {
//         return err + 400;
//     });
//     p2.then(data => {
//         console.log(data, '****');
//     }, err => {
//         console.log(err, 'error----');
//     })
// }

module promise31_async4 {
    const p = new Promise_Async<number>((resolve, reject) => {
        resolve(123)
    });

    const p2: any = p.then(data => {
        return p2;
    });
    p2.then(null, (data: any) => {
        console.log(data);
    });
}
