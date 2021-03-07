import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
fs.access(path.join(__dirname, '../node_modules'), fs.constants.F_OK, (err) => {
    try {
        if (err) {
            execSync('npm i');
        }
        execSync('node ./node_modules/.bin/tsc'); // 或者在package.json 中增加脚本 "prepare": "tsc"
        execSync('npm link');
        console.log(`DONE: npm link`);
    } catch (error) {
        throw Error(error);
    }
});
