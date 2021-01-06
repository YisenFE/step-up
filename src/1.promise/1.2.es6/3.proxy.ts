/**
 * @file proxy
 * Object.defineProperty 不支持数组的更新 push slice
 * 希望数组变化就能更新视图
 */
/// <reference path="../../../types/index.d.ts" />

module es63_1 {
    function fn() {
        function update() {
            console.log('更新视图');
        }

        let arr = [1, 2, 3];
        let proxy = new Proxy<any>(arr, {
            set(
                target: object,
                key: string | symbol,
                value: unknown
            ): boolean {
                /** 1 */
                // console.log(arguments);
                // update();
                // (target as any)[key] = value;
                // return true;

                /** 2 */
                update();
                return Reflect.set(target, key, value);
            },
            get(target, key) {
                /** 1 */
                // console.log(arguments);
                // return (target as any)[key];

                /** 2 */
                return Reflect.get(target, key);
            }
        });
        // proxy[0] = 100;
        proxy.push(12);
        console.log(proxy)
        proxy[0] = 1;
    }
    fn();
}
