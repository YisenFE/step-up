/**
 * @file promise实现
 */

export namespace _ {
    export type FulfillmentHandler<T, TResult> = ((value: T) => TResult | PromiseLike<TResult>) | undefined | null;
    export type RejectionHandler<TResult> = ((reason?: any) => TResult | PromiseLike<TResult>) | undefined | null;
    export type FinallyHandler = (() => void) | undefined | null;

    export interface PromiseLike<T> {
        then<TResult1 = T, TResult2 = never>(
            onFulfilled?: FulfillmentHandler<T, TResult1>,
            onRejected?: RejectionHandler<TResult2>
        ): PromiseLike<TResult1 | TResult2>;
    }

    export type Executor<T> = (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;

    export interface Promise<T> {
        then<TResult1 = T, TResult2 = never>(
            onFulfilled?: FulfillmentHandler<T, TResult1>,
            onRejected?: RejectionHandler<TResult2>
        ): Promise<TResult1 | TResult2>;

        catch<TResult = never>(onRejected?: RejectionHandler<TResult>): Promise<T | TResult>;

        finally(onFinally?: FinallyHandler): Promise<T>;
    }

    export interface PromiseConstructor {
        readonly prototype: Promise<any>;

        new <T>(
            executor: (
                resolve: (value: T | PromiseLike<T>) => void,
                reject: (reason?: any) => void
            ) => void
        ): Promise<T>;

        resolve(): Promise<void>;
        resolve<T>(value: T | PromiseLike<T>): Promise<T>;

        reject<T = never>(reason?: any): Promise<T>;

        all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>, T9 | PromiseLike<T9>, T10 | PromiseLike<T10>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
        all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>, T9 | PromiseLike<T9>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
        all<T1, T2, T3, T4, T5, T6, T7, T8>(values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8]>;
        all<T1, T2, T3, T4, T5, T6, T7>(values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>]): Promise<[T1, T2, T3, T4, T5, T6, T7]>;
        all<T1, T2, T3, T4, T5, T6>(values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>]): Promise<[T1, T2, T3, T4, T5, T6]>;
        all<T1, T2, T3, T4, T5>(values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>]): Promise<[T1, T2, T3, T4, T5]>;
        all<T1, T2, T3, T4>(values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>]): Promise<[T1, T2, T3, T4]>;
        all<T1, T2, T3>(values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>]): Promise<[T1, T2, T3]>;
        all<T1, T2>(values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>]): Promise<[T1, T2]>;
        all<T>(values: readonly [T | PromiseLike<T>]): Promise<T[]>;
        all<T>(values: Iterable<T | PromiseLike<T>>): Promise<T[]>;

        race<T>(values: readonly T[]): Promise<T extends PromiseLike<infer U> ? U : T>;
        race<T>(values: Iterable<T>): Promise<T extends PromiseLike<infer U> ? U : T>;
    }
}

const enum State {
    Pending = 'pending',
    FulFilled = 'fulfilled',
    Rejected = 'rejected'
}
export class Promise<T> implements _.Promise<T> {
    private _state: State = State.Pending;
    private _value: T | undefined = undefined;
    private _reason: any = undefined;

    private _onResolvedCallbacks: Function[] = [];
    private _onRejectedCallbacks: Function[] = [];

    constructor(executor: _.Executor<T>) {
        const _f = (v: T) => {
            if (this._state === State.Pending) {
                this._value = v;
                this._state = State.FulFilled;
                this._onResolvedCallbacks.forEach(cb => cb());
            }
        };
        const _r = (r?: any) => {
            if (this._state === State.Pending) {
                this._reason = r;
                this._state = State.Rejected;
                this._onRejectedCallbacks.forEach(cb => cb());

                if (!this._onRejectedCallbacks.length) {
                    console.error(new Error(' (in promise) ' + this._reason));
                }
            }
        };

        let called = false;
        const resolve = (v: T | _.PromiseLike<T>) => {
            if (called) return;
            called = true;
            this._resolvePromise(this, v, _f, _r);
        };
        const reject = (r?: any) => {
            if (called) return;
            called = true;
            _r(r);
        };
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    public then<TResult1 = T, TResult2 = never>(
        onFulfilled?: _.FulfillmentHandler<T, TResult1>,
        onRejected?: _.RejectionHandler<TResult2>
    ): _.Promise<TResult1 | TResult2> {
        const P: _.PromiseConstructor = Object.getPrototypeOf(this).constructor;

        const promise = new P<TResult1 | TResult2>((resolve, reject) => {
            const resHandler = () => {
                const _onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v: T) => v;
                setTimeout(() => {
                    try {
                        let x = _onFulfilled(this._value as T) as TResult1 | _.PromiseLike<TResult1>;
                        this._resolvePromise<TResult1 | TResult2>(promise, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            };
            const rejHandler = () => {
                const _onRejected = typeof onRejected === 'function' ? onRejected : (err: any) => { throw err };
                setTimeout(() => {
                    try {
                        let x = _onRejected(this._reason);
                        this._resolvePromise(promise, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            };

            if (this._state === State.FulFilled) resHandler();
            if (this._state === State.Rejected) rejHandler();
            if (this._state === State.Pending) {
                this._onResolvedCallbacks.push(resHandler);
                this._onRejectedCallbacks.push(rejHandler);
            }
        });

        return promise;
    }

    public catch<TResult = never>(onRejected: _.RejectionHandler<TResult>) {
        return this.then(null, onRejected);
    }

    public finally(onFinally?: _.FinallyHandler) {
        const _cb = typeof onFinally === 'function' ? onFinally : () => {};
        const P: _.PromiseConstructor = (Object.getPrototypeOf(this)).constructor;
        return this.then(
            v => P.resolve(_cb()).then(() => v),
            r => P.resolve(_cb()).then(() => { throw r })
        );
    }

    static resolve<T>(v: T | _.PromiseLike<T>): _.Promise<T> {
        return new this((resolve, reject) => {
            resolve(v);
        });
    }

    static reject<T>(r?: any): _.Promise<T> {
        return new this((resolve, reject) => {
            reject(r);
        });
    }

    static all<T extends any[]>(promises: readonly [...T]): _.Promise<{ [K in keyof T]: T[K] extends _.PromiseLike<infer R> ? R : T[K] }> {
        const P = this;
        return new P((resolve, reject) => {
            const len = promises.length;
            let remaining = len;

            const results: { [K in keyof T]: T[K] extends _.PromiseLike<infer R> ? R : T[K] } = new Array(len) as any;
            for (let i = 0; i < len; i++) {
                fllow(promises[i], i);
            }

            function fllow<T>(t: T | _.PromiseLike<T>, index: number): void {
                P.resolve(t).then(v => {
                    results[index] = v;
                    remaining--;
                    if (remaining === 0) {
                        resolve(results);
                    }
                }, (r?: any) => {
                    reject(r);
                });
            }
        });
    }

    static race<T>(promises: readonly T[]): _.Promise<T extends _.PromiseLike<infer U> ? U : T> {
        const P = this;
        return new Promise((resolve, reject) => {
            const len = promises.length;
            let i = 0;
            while (i < len) {
                fllow(promises[i]);
                i++;
            }

            function fllow(t: T | _.PromiseLike<T>): void {
                P.resolve(t).then(v => {
                    i = len;
                    resolve(v as any);
                }).catch(r => {
                    reject(r);
                });
            }
        });
    }

    private _resolvePromise<T>(
        promise: _.Promise<T>,
        x: T | _.PromiseLike<T>,
        resolve: (value: T) => void,
        reject: (reason?: any) => void
    ): void {
        if (promise === x) {
            return reject(new TypeError('循环引用'));
        }
        if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
            let called = false;
            try {
                const then = (x as _.PromiseLike<T>).then;
                if (typeof then === 'function') {
                    // x.then() // 有可能第一次取值报错，第二次取值不报错
                    then.call(x, (v: T | _.PromiseLike<T>) => {
                        if (called) return;
                        called = true;
                        // resolve(v);
                        this._resolvePromise(promise, v, resolve, reject);
                    }, (r?: any) => {
                        if (called) return;
                        called = true;
                        reject(r);
                    });
                } else {
                    resolve(x as T);
                }
            } catch (error) {
                if (called) return;
                called = true;
                reject(error);
            }
        } else {
            resolve(x);
        }
    }
}


(Promise as any).deferred = function() {
    let dfd: any = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};
