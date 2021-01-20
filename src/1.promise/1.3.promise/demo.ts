/**
 * @file demo
 */

import { Promise } from './promise';

{
    function fn1() {
        var p = new Promise((resolve, reject) => {
            // 入参promise
            resolve(new Promise((a, b) => {
                setTimeout(a, 500, '000');
            }));
            // 入参promiseLike
            resolve({
                then(res: any, rej: any) {
                    setTimeout(res, 500, '111');
                }
            });
            // 入参多层promiseLike
            resolve({
                then(res: any, rej: any) {
                    setTimeout(() => {
                        res({
                            then(a: any, b: any) {
                                setTimeout(a, 1000, '222');
                            }
                        });
                    }, 500);
                }
            });
            // 入参promiseLike
            reject({
                then(res: any, rej: any) {
                    setTimeout(res, 500, '333');
                }
            });

            resolve({
                then(res: any, rej: any) {
                    res({
                        then(a: any, b: any) {
                            setTimeout(() => {
                                a(111);
                            });
                        }
                    });
                    rej(222);
                }
            });
        });
        console.log('fn1----',p);
        setTimeout(console.log, 600, 'fn1----', p);
        setTimeout(console.log, 1600, 'fn1----', p);
    }
    // fn1();
}

{ // _resolvePromise
    function fn2() {
        // 循环调用
        var p = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(p);
            }, 500);
        });
        setTimeout(console.log, 600, 'fn2----', p);
    }
    // fn2();
    function fn3() {
        var obj = {};
        Object.defineProperty(obj, 'then', {
            get() {
                throw 'then报错';
            }
        });
        var obj1 = {then: 123};
    }
}

{ // then
    function fn4() {
        function i1() {
            //? 返回实例本身还是返回一个新的实例
            var p = new Promise((resolve, reject) => {
                resolve(12);
            });
            var p1 = p.then(res => {
                throw 123;
            });
            console.log('fn4-i1----', p, p1);
            setTimeout(console.log, 100, 'fn4-i1----', p, p1);
        }
        // i1();

        function i2() {
            // 成功的then返回一个promiseLike
            var p = new Promise((resolve, reject) => {
                resolve(111);
            }).then(() => {
                return new Promise((res) => {
                    setTimeout(() => {
                        res(222);
                    }, 1000);
                })
            });
            console.log('fn4-i2----', p);
            setTimeout(console.log, 1100, 'fn4-i2---' ,p);
        }
        // i2();

        function i3() {
            // 失败的then返回一个promiseLike
            var p = new Promise((resolve, reject) => {
                reject(111);
            }).then(null, () => {
                return {
                    then(res: any, rej: any) {
                        setTimeout(res, 500, 222);
                    }
                }
            });
            setTimeout(console.log, 600, 'fn4-i3----', p);
        }
        // i3();

    }
    // fn4();
}
