interface Function {
    before: (callback: Function) => (...args: any[]) => void;
}

type Func<T=any[], R=any> = (...args: T) => R;
