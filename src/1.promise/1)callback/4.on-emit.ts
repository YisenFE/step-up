/// <reference path="../../../types/index.d.ts" />
/**
 * @file 发布订阅
 */
import fs from 'fs';
import { _path } from '../../utils/path';

module callback4_1 {
    type OnEmit = {
        arr: Func[];
        on: (fn: Func) => void;
        emit: Func<[], void>
    }
    const event: OnEmit = {
        arr: [],
        on(fn: Func) {
            this.arr.push(fn);
        },
        emit() {
            this.arr.forEach(fn => fn());
        }
    };
    const school: {name?: string, age?: string} = {};

    event.on(function() {
        if (Object.keys(school).length === 2) {
            console.log(school);
        }
    });

    event.on(function() {
        console.log('读取了一个');
    });

    fs.readFile(_path('name.txt'), 'utf8', (err, data) => {
        school.name = data;
        event.emit();
    });

    fs.readFile(_path('age.txt'), 'utf8', (err, data) => {
        school.age = data;
        event.emit();
    });
}

module callback4_1 {
    class EventEmitter {
        private _arr: Func[] = [];

        on(cb: Func) {
            this._arr.push(cb);
        }
        emit() {
            this._arr.forEach(fn => fn());
        }
    }
    const school: {name?: string, age?: string} = {};

    const event = new EventEmitter();

    event.on(function() {
        if (Object.keys(school).length === 2) {
            console.log(school);
        }
    });

    event.on(function() {
        console.log('读取了一个');
    });

    fs.readFile(_path('name.txt'), 'utf8', (err, data) => {
        school.name = data;
        event.emit();
    });

    fs.readFile(_path('age.txt'), 'utf8', (err, data) => {
        school.age = data;
        event.emit();
    });
}
