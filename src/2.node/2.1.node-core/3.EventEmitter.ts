/**
 * @file 事件触发器
 */
import EventEmitter from 'events';

export class MyEmitter extends EventEmitter.EventEmitter { }

namespace _ {
    const myEmitter = new MyEmitter();
    myEmitter.on('event', () => {
        console.log('触发事件');
    });
    myEmitter.emit('event');
}

namespace _ {
    const myEmitter = new MyEmitter();
    // this 指向EventEmitter的实例
    myEmitter.on('event', function(this: unknown, a, b) {
        console.log(a, b, this === myEmitter, this);
    });
    myEmitter.emit('event', 'a', 'b');
}

// 也可以使用 ES6 的箭头函数作为监听器。但 this 关键词不会指向 EventEmitter 实例：
export const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
    console.log(a, b, this === myEmitter, this);
});
myEmitter.emit('event', 'a', 'b');

namespace _ {
    const myEmitter = new MyEmitter();
    myEmitter.on(EventEmitter.errorMonitor, (err) => {
        console.log(err);
    });
    myEmitter.emit('error', new Error('错误'));
}
