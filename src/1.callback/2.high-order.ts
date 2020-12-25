/**
 * @file 柯里化 反柯里化
 */

module callback2_1 {
    /**
     * 判断变量的类型
     * 常用的判断类型的方法有四种：
     *      1. typeof
     *      2. constructor
     *      3. instanceof
     *      4. Object.prototype.toString.call()
     */
    function isType(value: any, type: string): boolean {
        return Object.prototype.toString.call(value) === `[object ${type}]`;
    }

    // console.log(isType([], 'Array'));

    // 能不能将方法进行细分 isType => isString isArray
}

module callback2_2 {
    function isType(type: string): (value: any) => boolean {
        return (value) => {
            return Object.prototype.toString.call(value) === `[object ${type}]`;
        };
    }

    // let isArray = isType('Array');
    // console.log(isArray('hello'));
    // console.log(isArray([]));

    // 通过一个柯里化函数 实现通用的柯里化方法
    function currying(fn: Function, arr: any[] = []) {
        let len = fn.length;
        return function (...args: any[]) {
            const internalArr = [...arr, ...args];
            if (internalArr.length < len) {
                return currying(fn, internalArr);
            } else {
                return fn(...internalArr);
            }
        };
    }

    let isArray = currying(isType)('Array');
    let isString = currying(isType)('String');

    console.log(isArray([]));
    console.log(isArray('123'));
}

