/**
 * @file 使用缓存策略
 * @description https://www.30secondsofcode.org/blog/s/javascript-memoization
 */
interface NewProxyHandler<T extends object> extends ProxyHandler<T> {
    cache: Map<any, any>
}

module _ {
    const memoize = (fn: Function) => new Proxy(fn, {
        cache: new Map(),
        apply(target, thisArg, argsList) {
            let cacheKey = argsList.toString();
            if (!this.cache.has(cacheKey))
                this.cache.set(cacheKey, target.apply(thisArg, argsList));
            return this.cache.get(cacheKey);
        }
    } as NewProxyHandler<Function>);

    const fibonacci = (n: number): number => (n <= 1 ? 1 : fibonacci(n - 1) + fibonacci(n - 2));
    const memoizedFibonacci = memoize(fibonacci);

    console.time('没缓存');
    for (let i = 0; i < 100; i++) fibonacci(30);
    console.timeEnd('没缓存');
    console.time('有缓存');
    for (let i = 0; i < 100; i++) memoizedFibonacci(30);
    console.timeEnd('有缓存');
}

