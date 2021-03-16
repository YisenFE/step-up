#! /usr/bin/env node
/// <reference path="../types/global.d.ts" />

import { Command } from 'commander';

import packageJson from '../package.json';

import { Server, ServerOptions, CacheMode } from './server';

const defaultCfg: ServerOptions = {
    port: '3000',
    host: '127.0.0.1',
    dir: process.cwd(),
    cacheMode: CacheMode.Weak
};

const program = new Command();

program.version(packageJson.version)
    .option('-p, --port <n>', 'set http-server port', defaultCfg.port)
    .option('-o, --host <n>', 'set http-server host', defaultCfg.host)
    .option('-d, --dir <n>', 'set http-server directory', defaultCfg.dir)
    .option(
        '-c, --cache-mode <n>', 'set cache mode：force, simpleWeak, weak',
        defaultCfg.cacheMode
    );

program.parse(process.argv);
const options = program.opts() as ServerOptions;

const server = new Server(options);
server.start();

