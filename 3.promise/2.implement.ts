/**
 * @file promise实现
 */
export namespace _ {
    export type Status = 'pending' | 'fulfilled' | 'rejected';

    export type InternalResolve<T> = (value: T | PromiseLike<T>) => void;
    export type InternalReject = (reason?: any) => void;

    export type FulfillmentHandler<T, TResult> = ((value: T) => TResult | PromiseLike<TResult>) | undefined | null;
    export type RejectionHandler<TResult> = ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null;

    export interface PromiseLike<T> {
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?: FulfillmentHandler<T, TResult1>,
            onrejected?: RejectionHandler<TResult2>
        ): PromiseLike<TResult1 | TResult2>;
    }


    export type Executor<T> = (resolve: InternalResolve<T>, reject: InternalReject) => void;

    export interface Promise<T> {
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?: FulfillmentHandler<T, TResult1>,
            onrejected?: RejectionHandler<TResult2>
        ): Promise<TResult1 | TResult2>;

        // catch<TResult = never>(onrejected?: RejectionHandler<T>): Promise<T | TResult>;
    }

    export interface PromiseConstructor {
        // readonly prototype: Promise<any>;

        new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
    }
}

// 解决同步状态更新
export class Promise_Sync<T> /* implements _.Promise<T> */ {
    status: _.Status = 'pending';
    value: any = undefined;
    reason: any = undefined;
    constructor(executor: _.Executor<T>) {
        const resolve = (value: T | _.PromiseLike<T>) => {
            if (this.status === 'pending') {
                this.value = value;
                this.status = 'fulfilled';
            }
        };
        const reject = (reason: any) => {
            if (this.status === 'pending') {
                this.reason = reason;
                this.status = 'rejected';
            }
        }

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }


    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: _.FulfillmentHandler<T, TResult1>,
        onrejected?: _.RejectionHandler<TResult2>
    ) {
        if (this.status === 'fulfilled') {
            typeof onfulfilled === 'function' && onfulfilled(this.value);
        }
        if (this.status === 'rejected') {
            typeof onrejected === 'function' &&  onrejected(this.reason);
        }
    }
}

// 解决异步状态更新
export class Promise_Async<T> /* implements _.Promise<T> */ {
    private status: _.Status = 'pending';
    private value: any = undefined;
    private reason: any = undefined;

    private onResolvedCallbacks: Function[] = [];
    private onRejectedCallbacks: Function[] = [];

    // private OwnConstructor: _.PromiseConstructor;

    constructor(executor: _.Executor<T>) {
        // this.OwnConstructor = new.target;

        const resolve = (value: T | _.PromiseLike<T>) => {
            if (this.status === 'pending') {
                this.value = value;
                this.status = 'fulfilled';
                this.onResolvedCallbacks.forEach(cb => cb());
            }
        };
        const reject = (reason: any) => {
            if (this.status === 'pending') {
                this.reason = reason;
                this.status = 'rejected';
                this.onRejectedCallbacks.forEach(cb => cb());
            }
        }

        try {
            executor(resolve, reject);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    }

    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: _.FulfillmentHandler<T, TResult1>,
        onrejected?: _.RejectionHandler<TResult2>
    ): _.Promise<TResult1 | TResult2> {

        const PConstructor: _.PromiseConstructor = (Object.getPrototypeOf(this).constructor)
        const promise2= new PConstructor<TResult1 | TResult2>((resolve, reject) => {

            let _onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : (value: any) => value;
            let _onrejected = typeof onrejected === 'function' ? onrejected : (reason: any) => reason;

            if (this.status === 'fulfilled') {
                setTimeout(() => {
                    try {
                        let x = _onfulfilled(this.value);
                        this._resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
            if (this.status === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = _onrejected(this.reason);
                        this._resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
            if (this.status === 'pending') {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = _onfulfilled(this.value);
                            this._resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    })
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = _onrejected(this.reason);
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
            try {
                const then = x.then;
                if (typeof then === 'function') {
                    then.call(x, (x: T) => {
                        resolve(x);
                    }, (y: any) => {
                        reject(y);
                    });
                    // x.then() // 有可能第一次取值报错，第二次取值不报错
                } else {
                    resolve(x);
                }
            } catch (error) {
                reject(error);
            }

        } else {
            resolve(x);
        }
    }
}

