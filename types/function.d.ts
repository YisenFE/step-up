interface Function {
    before: (callback: Function) => (...args: any[]) => void;
}
