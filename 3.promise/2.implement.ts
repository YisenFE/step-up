/**
 * @file promise实现
 */
export namespace _ {
    export type Resolved<T, TResult> = ((value: T) => TResult | PromiseLike<TResult>) | undefined | null;
    export type Rejected<TResult> = ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null;

    export interface PromiseLike<T> {
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?: Resolved<T, TResult1>,
            onrejected?: Rejected<TResult2>
        ): PromiseLike<TResult1 | TResult2>;
    }


    export type Executor<T> = (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;

    export interface Promise<T> {
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?: Resolved<T, TResult1>,
            onrejected?: Rejected<TResult2>
        ): Promise<TResult1 | TResult2>;

        // catch<TResult = never>(onrejected?: Rejected<T>): Promise<T | TResult>;
    }

    export interface PromiseConstructor {
        readonly prototype: Promise<any>;

        new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
    }
}

// 解决同步状态更新
export class Promise_Sync<T> /* implements _.Promise<T> */ {
    status: string = 'pending';
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
        onfulfilled?: _.Resolved<T, TResult1>,
        onrejected?: _.Rejected<TResult2>
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
export class Promise_Async<T> implements _.Promise<T> {
    private status: string = 'pending';
    private value: any = undefined;
    private reason: any = undefined;

    private onResolvedCallbacks: Function[] = [];
    private onRejectedCallbacks: Function[] = [];

    private OwnConstructor: any;

    constructor(executor: _.Executor<T>) {
        this.OwnConstructor = new.target;

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
            reject(error);
        }
    }


    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: _.Resolved<T, TResult1>,
        onrejected?: _.Rejected<TResult2>
    ) {
        const promise2 = new this.OwnConstructor;
        if (this.status === 'fulfilled') {
            typeof onfulfilled === 'function' && onfulfilled(this.value);
        }
        if (this.status === 'rejected') {
            typeof onrejected === 'function' &&  onrejected(this.reason);
        }
        if (this.status === 'pending') {
            this.onResolvedCallbacks.push(() => {
                typeof onfulfilled === 'function' && onfulfilled(this.value);
            });
            this.onRejectedCallbacks.push(() => {
                typeof onrejected === 'function' && onrejected(this.reason);
            });
        }
    }
}

