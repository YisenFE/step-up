/**
 * @file 装饰器
 */
// "experimentalDecorators": true
module es64_1 {
    function fn() {
        function f() {
            console.log("f(): evaluated");
            return function (
                target: object,
                propertyKey: string,
                descriptor: PropertyDescriptor
            ) {
                console.log("f(): called");
            };
        }

        function g() {
            console.log("g(): evaluated");
            return function (
                target: object,
                propertyKey: string,
                descriptor: PropertyDescriptor
            ) {
                console.log("g(): called");
            };
        }
        function c(constructor: Function) {
            console.log(constructor);
        }

        @c
        class C {
            constructor() {}
            @f()
            @g()
            method() { }
        }
        var a = new C();
    }
    // fn();
}

module es64_2 {
    function fn() {
        function sealed(constructor: Function) {
            Object.seal(constructor);
            Object.seal(constructor.prototype);
        }

        @sealed
        class Greeter {
            greeting: string;
            [k: string]: any;
            constructor(message: string) {
                this.greeting = message;
            }
            greet() {
                return 'Hello, ' + this.greeting;
            }
        }
        // (Greeter as any).a = 1 // ERROR: object is not extensible
        // Greeter.prototype.a = () => {}; // ERROR: object is not extensible
    }
    // fn();
}

module es64_3 {
    function fn() {
        function classDecorator<T extends { new (...p: any[]): {} }>(
            constructor: T
        ) {
            return class extends constructor {
                newProperty = 'new property';
                hello = 'override';
            };
        }

        @classDecorator
        class Greeter {
            property = 'property';
            hello: string;
            constructor(m: string) {
                this.hello = m;
            }
        }

        console.log(new Greeter('world'));
        /**
         * Greeter {
         *      property: 'property',
         *      hello: 'override',
         *      newProperty: 'new property'
         * }
         */
    }
    // fn();
}

module es64_4 {
    function fn(boo: boolean) {
        function enumrable(value: boolean) {
            return function(
                target: any,
                propertyKey: string,
                descriptor: PropertyDescriptor
            ) {
                descriptor.enumerable = value;
                console.log(target, propertyKey, descriptor);
            };
        }
        class Greeter {
            greeting: string;
            constructor(message: string) {
                this.greeting = message;
            }

            @enumrable(boo)
            greet() {
                return 'hello, ' + this.greeting;
            }
        }

        console.log(Greeter.prototype)
    }
    // fn(true); // Greeter { greet: [Function: greet] }
    // fn(false); // Greeter {}
}

module es64_5 {
    function fn() {
        function configurable(value: boolean) {
            return function (
                target: any,
                propertyKey: string,
                descriptor: PropertyDescriptor
            ) {
                descriptor.configurable = value;
            };
        }

        class Point {
            private _x: number;
            private _y: number;
            constructor(x: number, y: number) {
                this._x = x;
                this._y = y;
            }

            @configurable(false)
            get x() {
                return this._x;
            }

            @configurable(false)
            get y() {
                return this._y;
            }
        }

        var point = new Point(1, 2);
        console.log(point.x, point.y);
    }
    fn();
}
