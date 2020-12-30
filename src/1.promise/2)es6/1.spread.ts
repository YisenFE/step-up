/**
 * @file deepClone
 */
module es61_1 {
    // TODO: 使用ts如何定义类型
    function deepClone(obj: any, hash: any = new WeakMap()) {
        if (obj == null) return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof RegExp) return new RegExp(obj);
        if (typeof obj === 'function') return obj;
        if (typeof obj !== 'object') return obj;

        if (hash.has(obj)) return hash.get(obj);

        let cloneObj = new obj.constructor;

        hash.set(obj, cloneObj);

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloneObj[key]= deepClone(obj[key]);
            }
        }

        return cloneObj;
    }

    // console.log(deepClone(1));
}
