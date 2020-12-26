/// <reference path="../../types/index.d.ts" />
/**
 * @file after
 */
import fs from 'fs';
import { _path } from '../../utils/path';

module callback3_1 {
    const school: {name?: string, age?: string} = {};

    let index = 0;
    const cb = () => {
        if (++index === 2) {
            console.log(school);
        }
    }
    fs.readFile(_path('name.txt'), 'utf8', (err, data) => {
        school.name = data;
        cb();
    });

    fs.readFile(_path('age.txt'), 'utf8', (err, data) => {
        school.age = data;
        cb();
    });
}

module callback3_2 {
    const school: {name?: string, age?: string} = {};

    function after(times: number, callback: Function): () => void {
        return function() {
            if (--times === 0) {
                callback();
            }
        };
    }

    let cb = after(2, function() {
        console.log(school);
    });
    fs.readFile(_path('name.txt'), 'utf8', (err, data) => {
        school.name = data;
        cb();
    });

    fs.readFile(_path('age.txt'), 'utf8', (err, data) => {
        school.age = data;
        cb();
    });
}
