/**
 * @file 观察者模式
 * 有观察者 被观察者 观察者需要放到被观察者中，被观察者的状态发生改变需要通知观察者
 */

module callback5_1 {
    // 我和我媳妇 需要观察小宝宝心理状态的变化
    class Subject { // 被观察者 小宝宝
        state: string;
        observers: any[];
        constructor(public name: string) {
            this.state = '开心的';
            this.observers = [];
        }
        attach(o: Observer): void {
            this.observers.push(o);
        }
        setState(this: Subject, newState: string) {
            this.state = newState;
            this.observers.forEach((o: Observer) => o.update(this));
        }
    }

    class Observer { // 观察者 我 我媳妇
        constructor(public name: string) {}
        update(baby: Subject) {
            console.log('当前' + this.name + '被通知了', '当前小宝宝的状态是' + baby.state);
        }
    }

    let baby: Subject = new Subject('小宝宝');
    let parent: Observer = new Observer('爸爸');
    let mother: Observer = new Observer('妈妈');

    baby.attach(parent);
    baby.attach(mother);
    baby.setState('被欺负了');
}
