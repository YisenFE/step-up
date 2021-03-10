#! /usr/bin/env node
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import packageJson from '../package.json';


spawnSync('npm', ['uninstall', '-g', ...Object.keys(packageJson.bin)]);

fs.rm(path.resolve(__dirname, '../dist'), {recursive: true}, () => {
    console.log('[DEL success]: dist');
});

fs.rm(path.resolve(__dirname, '../node_modules'), {recursive: true}, () => {
    console.log('[DEL success]: node_modules');
});
