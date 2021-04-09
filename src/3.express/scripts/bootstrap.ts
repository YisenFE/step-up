import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
fs.access(path.join(__dirname, '../node_modules'), fs.constants.F_OK, (err) => {
    try {
        if (err) {
            const install = spawn('npm', ['i']);
            install.stdout.on('data', (data) => console.log(`${data}`));
            install.stderr.on('data', (data) => console.log(`${data}`));
            install.on('close', () => console.log('DONE: npm run bootstrap'));
        } else {
            console.log('DONE: npm run bootstrap');
        }
    } catch (error) {
        throw Error(error);
    }
});
