/// <reference path="../../types/index.d.ts" />
/**
 * @file Object.defineProperty es5 vue
 */

// module es62_1 {
//     let obj: Object1 = {};
//     let other = '';
//     Object.defineProperty(obj, 'name', {
//         // value: 'hello',
//         enumerable: true,
//         configurable: true, // delete obj.name;
//         // writable: true, // 是否可以重写
//         get() {
//             console.log('get')
//             return other;
//         },
//         set(val) {
//             other = val;
//         }
//     });
//     // delete obj.name;
//     console.log(obj);
//     obj.name = 1;
//     console.log(obj.name);
// }

module es62_2 {
    function update() {
        console.log('update view');
    }
    let data: Object1 = {
        name: 'zf',
        age: 18,
        address: {
            location: 'Beijing'
        }
    };

    function observer(obj: Object1) {
        if (typeof obj !== 'object') return obj;
        for (let key in obj) {
            defineReactive(obj, key, obj[key]);
        }
    }
    function defineReactive(obj: Object1, key: string, value: any) {
        observer(value);
        Object.defineProperty(obj, key, {
            get() {
                console.log('get');
                return value;
            },
            set(val) {
                if (val !== value) {
                    observer(val);
                    update();
                    console.log('set');
                    value = val;
                }
            }
        });
    }

    observer(data);

    data.age = 1000;

    data.address = {
        location: 'Hebei'
    };

    data.address.location = '1';

    data.address = [1,2,3];
    let methods = ['push', 'slice', 'pop', 'sort', 'reverse', 'unshift'];
    methods.forEach((fn: string)=> {
        const proto: Object1 = Array.prototype;
        let oldFn = proto[fn];
        proto[fn] = function() {
            update();
            oldFn.call(this, ...arguments);
        }
    });

}
