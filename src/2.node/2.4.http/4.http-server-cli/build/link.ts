import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
fs.access(path.join(__dirname, '../node_modules'), fs.constants.F_OK, (err) => {
    try {
        if (err) {
            spawnSync('npm', ['i']);
        }
        const distPath = path.resolve(__dirname, '../dist');
        fs.mkdir(resolvePath('../dist'), () => {
            spawnSync('cp', ['-R', resolvePath('../public'), resolvePath('../dist')]);
            spawnSync('node', [resolvePath('../node_modules/.bin/tsc')]);
            spawnSync('npm', ['link']);
            console.log(`DONE: npm link`);
        });
    } catch (error) {
        throw Error(error);
    }
});

function resolvePath(relativePath: string) {
    return path.resolve(__dirname, relativePath);
}
