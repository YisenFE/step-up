import { resolve } from "path";

/**
 * @file promise实现
 */

export namespace _ {
    export type InternalResolve<T> = (value: T | PromiseLike<T>) => void;
    export type InternalReject = (reason?: any) => void;

    export type FulfillmentHandler<T, TResult> = ((value: T) => TResult | PromiseLike<TResult>) | undefined | null;
    export type RejectionHandler<TResult> = ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null;
    export type FinallyHandler = (() => void) | undefined | null;

    export interface PromiseLike<T> {
        then<TResult1 = T, TResult2 = never>(
            onFulfilled?: FulfillmentHandler<T, TResult1>,
            onRejected?: RejectionHandler<TResult2>
        ): PromiseLike<TResult1 | TResult2>;
    }


    export type Executor<T> = (resolve: InternalResolve<T>, reject: InternalReject) => void;

    export interface Promise<T> {
        then<TResult1 = T, TResult2 = never>(
            onFulfilled?: FulfillmentHandler<T, TResult1>,
            onRejected?: RejectionHandler<TResult2>
        ): Promise<TResult1 | TResult2>;

        catch<TResult = never>(onRejected?: RejectionHandler<TResult>): Promise<T | TResult>;

        finally(onfinally?: FinallyHandler): Promise<T>;
    }

    export interface PromiseConstructor {
        readonly prototype: Promise<any>;

        new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;

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
    }
}

const enum State {
    Pending = 'pending',
    FulFilled = 'fulfilled',
    Rejected = 'rejected'
}
export class Promise<T> implements _.Promise<T> {
    private _state = State.Pending;
    private _value: any = undefined;
    private _reason: any = undefined;

    private onResolvedCallbacks: Function[] = [];
    private onRejectedCallbacks: Function[] = [];

    constructor(executor: _.Executor<T>) {
        const resolve = (v: T | _.PromiseLike<T>) => {
            if (this._state === State.Pending) {
                this._value = v;
                this._state = State.FulFilled;
                this.onResolvedCallbacks.forEach(cb => cb());
            }
        };
        const reject = (r: any) => {
            if (this._state === State.Pending) {
                this._reason = r;
                this._state = State.Rejected;
                this.onRejectedCallbacks.forEach(cb => cb());
                if (!this.onRejectedCallbacks.length) {
                    console.error(new Error(' (in promise) ' + this._reason.toString()));
                }
            }
        }

        try {
            executor(resolve, reject);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    }

    public then<TResult1 = T, TResult2 = never>(
        onFulfilled?: _.FulfillmentHandler<T, TResult1>,
        onRejected?: _.RejectionHandler<TResult2>
    ): _.Promise<TResult1 | TResult2> {
        const P: _.PromiseConstructor = (Object.getPrototypeOf(this).constructor);

        const promise2 = new P<TResult1 | TResult2>((resolve, reject) => {
            let _onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v: T) => v;
            let _onRejected = typeof onRejected === 'function' ? onRejected : (err: any) => { throw err };

            if (this._state === State.FulFilled) {
                setTimeout(() => {
                    try {
                        let x = _onFulfilled(this._value);
                        this._resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
            if (this._state === State.Rejected) {
                setTimeout(() => {
                    try {
                        let x = _onRejected(this._reason);
                        this._resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
            if (this._state === State.Pending) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = _onFulfilled(this._value);
                            this._resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    })
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = _onRejected(this._reason);
                            this._resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    })
                });
            }
        });

        return promise2;
    }

    public catch<TResult = never>(onRejected: _.RejectionHandler<TResult>) {
        return this.then(null, onRejected);
    }

    public finally(cb?: _.FinallyHandler) {
        const _cb = typeof cb === 'function' ? cb : () => {};
        const P: _.PromiseConstructor = (Object.getPrototypeOf(this)).constructor;
        return this.then(
            v => P.resolve(_cb()).then(() => v),
            r => P.resolve(_cb()).then(() => { throw r })
        );
    }

    static resolve<T>(v: T | _.PromiseLike<T>): _.Promise<T> {
        const P: _.PromiseConstructor = Object.getPrototypeOf(this).constructor;
        return new P(resolve => {
            resolve(v);
        });
    }

    static reject<T>(r: any): _.Promise<T> {
        const P: _.PromiseConstructor = Object.getPrototypeOf(this).constructor;
        return new P((resolve, reject) => {
            reject(r);
        });
    }

    static all<T extends any[]>(values: T): _.Promise<{ [K in keyof T]: T[K] extends _.PromiseLike<infer R> ? R : T[K] }> {
        const P: _.PromiseConstructor = Object.getPrototypeOf(this).constructor;
        return new P((resolve, reject) => {
            let len = values.length;
            let remaining = len;

            const results: { [K in keyof T]: T[K] extends _.PromiseLike<infer R> ? R : T[K] } = new Array(len) as any;
            for (let i = 0; i < len; i++) {
                fllow(values[i], i);
            }

            function fllow<T>(t: T | _.PromiseLike<T>, index: number): void {
                P.resolve(t).then(v => {
                    results[index] = v;
                    remaining--;
                    if (remaining === 0) {
                        resolve(results);
                    }
                }, r => {
                    reject(r);
                });
            }
        });
    }

    private _resolvePromise<T>(
        promise2: _.Promise<T>,
        x: any,
        resolve: _.InternalResolve<T>,
        reject: _.InternalReject
    ): void {
        if (promise2 === x) {
            return reject(new TypeError('循环引用'));
        }

        if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
            let called: boolean = false;
            try {
                const then = x.then;
                if (typeof then === 'function') {
                    // x.then() // 有可能第一次取值报错，第二次取值不报错
                    then.call(x, (v: T) => {
                        if (called) return;
                        called = true;
                        // resolve(v);
                        this._resolvePromise(promise2, v, resolve, reject);
                    }, (r: any) => {
                        if (called) return;
                        called = true;
                        reject(r);
                    });
                } else {
                    resolve(x);
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
