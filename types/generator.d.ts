interface Generator<T = unknown, TReturn = any, TNext = unknown> {
    apply(thisArg: any, arg1: Iterable<any>): Generator<unknown, any, unknown>;
}
