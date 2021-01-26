/**
 * @file 什么时候用到iterators
 * @description https://www.30secondsofcode.org/blog/s/javascript-iterators
 */

namespace _ {
    interface Item {
        id: string;
        value: string;
        next: string | null;
        head: boolean;
    }
    export class LinkedList implements Iterable<string> {
        constructor(public data: Item[]) { }

        firstItem() {
            return this.data.find(i => i.id);
        }

        findById(id: string | number | null) {
            return this.data.find(i => i.id === id);
        }

        [Symbol.iterator]() {
            let item: Item | undefined = { next: this.firstItem()!.id } as any;
            return {
                next: (): IteratorResult<string> => {
                    item = this.findById((item as Item).next);
                    if (item) {
                        return { value: item.value, done: false };
                    }
                    return { value: undefined, done: true };
                }
            }
        }
    }
    function demo1() {
        const myList = new LinkedList([
            { id: 'a10', value: 'First', next: 'a13', head: true },
            { id: 'a11', value: 'Last', next: null, head: false },
            { id: 'a12', value: 'Third', next: 'a11', head: false },
            { id: 'a13', value: 'Second', next: 'a12', head: false }
        ]);
        for (let item of myList) {
            console.log(item);    // 'First', 'Second', 'Third', 'Last'
        }
    }
    // demo1();
}

namespace __ {
    interface Item {
        complete: boolean;
        value?: string
    }
    class SpecialList implements Iterable<any> {
        constructor(public data: Item[]) {}

        [Symbol.iterator]() {
            return this.data[Symbol.iterator]();
        }

        values() {
            return this.data
                .filter(i => i.complete)
                .map(i => i.value)
            [Symbol.iterator]();
        }
    }
    function demo2() {
        const myList = new SpecialList([
            { complete: true, value: 'Lorem ipsum' },
            { complete: true, value: 'dolor sit amet' },
            { complete: false },
            { complete: true, value: 'adipiscing elit' }
        ]);

        for (let item of myList) {
            console.log(item);  // The exact data passed to the SpecialList constructor above
        }

        for (let item of myList.values()) {
            console.log(item);  // 'Lorem ipsum', 'dolor sit amet', 'adipiscing elit'
        }
    }
    // demo2();
}

namespace ___ {
    class Component {
        constructor(public name: string) {}
    }

    function demo1() {
        class Frame implements Iterator<Component> {
            private pointer = 0;
            constructor(public name: string, public components: Component[]) {}
            public next(): IteratorResult<Component> {
                if (this.pointer < this.components.length) {
                    return {
                        done: false,
                        value: this.components[this.pointer++]
                    };
                } else {
                    return {
                        done: true,
                        value: null
                    }
                }
            }
        }
        let frame = new Frame('Door', [
            new Component('top'),
            new Component('right'),
            new Component('bottom'),
            new Component('left')
        ]);
        let iteratorResult1 = frame.next();
        console.log(iteratorResult1); // { done: false, value: Component { name: 'top' } }
    }
    function demo2() {
        class Frame implements Iterable<Component> {
            constructor(public name: string, public components: Component[]) {}

            [Symbol.iterator]() {
                let pointer = 0;
                let components = this.components;

                return {
                    next(): IteratorResult<Component> {
                        if (pointer < components.length) {
                            return {
                                done: false,
                                value: components[pointer++]
                            };
                        } else {
                            return {
                                done: true,
                                value: null
                            }
                        }
                    }
                };
            }
        }
        let frame = new Frame('Door', [
            new Component('top'),
            new Component('right'),
            new Component('bottom'),
            new Component('left')
        ]);
        for (let cmp of frame) {
            console.log(cmp);
        }
        // frame.next() 不适用于这种模式，有点笨重
    }
    function demo3() {
        class Frame implements Iterable<Component> {
            private pointer = 0;
            constructor(public name: string, public components: Component[]) {}

            public next(): IteratorResult<Component> {
                if (this.pointer < this.components.length) {
                    return {
                        done: false,
                        value: this.components[this.pointer++]
                    };
                } else {
                    return {
                        done: true,
                        value: null
                    };
                }
            }

            [Symbol.iterator](): IterableIterator<Component> {
                return this;
            }
        }
        let frame = new Frame('Door', [
            new Component('top'),
            new Component('right'),
            new Component('bottom'),
            new Component('left')
        ]);
        console.log(frame.next());
        for (let cmp of frame) {
            console.log(cmp);
        }
    }
    function demo4() {
        class Fib implements IterableIterator<number> {
            protected fn1 = 0;
            protected fn2 = 1;

            constructor(protected maxValue?: number) {}

            public next(): IteratorResult<number> {
                let current = this.fn1;
                this.fn1 = this.fn2;
                this.fn2 = current + this.fn1;
                if (this.maxValue != null && current >= this.maxValue) {
                    return {
                        done: true,
                        value: null
                    };
                }
                return {
                    done: false,
                    value: current
                }
            }
            [Symbol.iterator](): IterableIterator<number> {
                return this;
            }
        }

        let fib = new Fib();
        fib.next(); // { done: false, value: 0 }
        fib.next(); // { done: false, value: 1 }
        fib.next(); // { done: false, value: 1 }
        fib.next(); // { done: false, value: 2 }
        fib.next(); // { done: false, value: 3 }
        fib.next(); // { done: false, value: 5 }

        let fibMax50 = new Fib(50);
        console.log(Array.from(fibMax50)); // [0,1,1,2,3,5,8,13,21,34]

        let fibMax21 = new Fib(21);
        for (let num of fibMax21) {
            console.log(num); // 输出 Fibonacci 序列 0 ～ 21
        }
    }

    // demo1();
    // demo2();
    // demo3();
    // demo4();
}
