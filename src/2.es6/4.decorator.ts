/**
 * @file 装饰器
 */
// "experimentalDecorators": true
module es64_1 {
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

    class C {
        @f()
        @g()
        method() { }
    }
    var a = new C();
    // f(): evaluated
    // g(): evaluated
    // g(): called
    // f(): called
}

module es64_2 {
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

module es64_3 {
    function classDecorator<T extends { new (...p: any[]): {} }>(
        construct: T
    ) {
        return class extends construct {
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
}

module es64_4 {
    function enumrable(value: boolean) {
        return function(
            target: any,
            propertyKey: string,
            descriptor: PropertyDescriptor
        ) {
            descriptor.enumerable = value;
        };
    }
    class Greeter {
        greeting: string;
        constructor(message: string) {
            this.greeting = message;
        }

        // @enumrable(true)
        greet() {
            return 'hello, ' + this.greeting;
        }
    }

    console.log(Greeter.prototype)
}

module es64_5 {
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
}
