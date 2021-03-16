import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
fs.access(path.join(__dirname, '../node_modules'), fs.constants.F_OK, (err) => {
    try {
        if (err) {
            spawnSync('npm', ['i']);
        }

        spawnSync('node', [resolvePath('../node_modules/.bin/tsc')]);
        spawnSync('cp', ['-R', resolvePath('../public'), resolvePath('../dist')]);
        console.log(`DONE: dist`);
    } catch (error) {
        throw Error(error);
    }
});

function resolvePath(relativePath: string) {
    return path.resolve(__dirname, relativePath);
}
