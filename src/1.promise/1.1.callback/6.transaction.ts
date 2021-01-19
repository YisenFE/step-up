module _ {
    export interface WrappersItem {
        initialize?: Function;
        close?: Function;
    }

    const sum = pipeAsyncFunctions(
        (x: number) => x + 1,
        (x: number) => new Promise(resolve => setTimeout(() => resolve(x + 2), 1000)),
        (x: number) => x + 3,
        async (x: number) => (await x) + 4,
        (x: number) => x
    );
    transaction((x: number) => {
        console.log(x, 'anyMethods');
        return new Promise(resolve => {
            window.setTimeout(() => {
                return resolve(x);
            }, 5000);
        });
    }, [
        {
            initialize: (x: number) => x + 1,
            close: (x: number) => x + 3,
        },
        {
            initialize: (x: number) => new Promise(resolve => setTimeout(() => resolve(x + 2), 1000)),
            close: async (x: number) => (await x) + 4,
        },
        {
            close: (x: number) => console.log(x)
        }
    ]);

    function isFunction(val: any): val is Function {
        return typeof val === 'function';
    }

    function transaction(anyMethod: Function, wrappers: WrappersItem[]) {
        const initializes: Function[] = [];
        const closes: Function[] = [];
        wrappers.forEach(wrapper => {
            isFunction(wrapper.initialize) && initializes.push(wrapper.initialize);
            isFunction(wrapper.close) && closes.push(wrapper.close);
        });
        pipeAsyncFunctions(...initializes, anyMethod, ...closes);
    }

    function pipeAsyncFunctions(...fns: any[]) {
        return fns.reduce((p, f) => p.then(f), Promise.resolve(0));
    }
}
