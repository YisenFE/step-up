/**
 * @file promise使用介绍
 */
import { Promise } from './promise';

import fs from 'fs';
import { _path } from '../../utils/path';

/** 同步状态变更 */
module promise31_0 {
    function fn() {
        const p = new Promise<string>((resolve, reject) => {
            resolve('成功');
        });
        p.then(val => {
            console.log('[SUCCESS] ', val);
        }, err => {
            console.log('[FAIL] ', err);
        });

        p.then(val => {
            console.log('[SUCCESS] ', val);
            // return '测试：链式调用then';
        }, err => {
            console.log('[FAIL] ', err);
        }).then(val => {
            console.log('[SUCCESS] ', '测试成功：链式调用then', val);
        }, err => {
            console.log('[FAIL] ', '测试成功：链式调用then', err)
        });
    }
    // fn();
}

/** 异步状态变更 */
module promise31_1 {
    function fn() {
        const p = new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                resolve('成功');
                // reject('失败');
            }, 1000);
        });
        p.then(val => {
            console.log('[SUCCESS] ', val);
        }, err => {
            console.log('[FAIL] ', err);
        });

        p.then(val => {
            console.log('[SUCCESS] ', val);
            // return '测试：链式调用then';
        }, err => {
            console.log('[FAIL] ', err);
        }).then(val => {
            console.log('[SUCCESS] ', '测试成功：链式调用then', val);
        }, err => {
            console.log('[FAIL] ', '测试成功：链式调用then', err)
        });
    }
    // fn();
}

/** 同异步结合 */
module promise31_2 {
    function fn1() {
        const p = new Promise<string>((resolve, reject) => {
            resolve('同步成功');
            // reject('同步失败');
        });
        p.then(val => {
            console.log('[SUCCESS] ', val);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject('同步成功状态转为异步失败状态');
                });
            });
        }, err => {
            console.log('[FAIL] ', err);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve('同步失败状态转为异步成功状态');
                });
            });
        }).then(val => {
            console.log('[SUCCESS] ', '测试成功：then返回异步promise', val);
        }, err => {
            console.log('[FAIL] ', '测试成功：then返回异步promise', err);
        });
    }
    function fn2() {
        const p1 = new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                resolve('异步成功');
                // reject('异步失败');

            });
        });
        p1.then(val => {
            console.log('[SUCCESS] ', val);
            return new Promise((resolve, reject) => {
                reject('异步成功状态转为同步失败状态');
            });
        }, err => {
            console.log('[FAIL] ', err);
            return new Promise((resolve, reject) => {
                resolve('异步失败状态转为同步成功状态');
            });
        }).then(val => {
            console.log('[SUCCESS] ', '测试成功：then返回同步promise', val);
        }, err => {
            console.log('[FAIL] ', '测试成功：then返回同步promise', err);
        });
    }

    // fn1();
    // fn2();
}

/** then返回promise */
module promise31_3 {
    function fn() {
        read(_path('name.txt')).then(data => {
            return read(_path(data));
        }).then(data => {
            console.log(data);
        });


        function read(url: string) {
            return new Promise<string>((resolve, reject) => {
                fs.readFile(url, 'utf8', (err, data) => {
                    if (err) return reject(err);
                    resolve(data);
                });
            });
        }
    }
    // fn();
}

/** 捕获错误 */
module promise31_4 {
    function fn() {
        const p = new Promise<number>((resolve, reject) => {
            resolve(123);
        });

        const p2 = p.then(data => {
            throw new Error(data.toString());
        }, err => {
            return err + 400;
        });
        p2.then(data => {
            console.log('[SUCCESS] ', data);
        }, err => {
            console.log('[FAIL] ', err);
        });
    }
    // fn();
}

/** 循环引用 */
module promise31_5 {
    function fn() {
        const p = new Promise<number>((resolve, reject) => {
            resolve(123);
        });

        const p2: any = p.then(data => {
            return p2;
        });
        p2.then(null, (data: any) => {
            console.log(data);
        });
    }
    // fn();
}

/** resolve参数是promise */
module promise31_6 {
    function fn1() {
        const p = new Promise<number>((resolve, reject) => {
            resolve(new Promise((res, rej) => {
                res(123);
            }));
        });

        p.then((res) => {
            console.log(res);
        }, err => {
            console.log(err);
        });
    }
    function fn2() {
        const p2 = new Promise<number>((resolve, reject) => {
            reject(new Promise((res, rej) => {
                setTimeout(() => {
                    rej(123);
                }, 1000);
            }));
        });
        p2.then((res) => {
            console.log(res, 'success');
        }, err => {
            console.log(err, 'err');
        });
    }

    // fn1();
    // fn2();
}
