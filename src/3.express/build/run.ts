import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import chalk from 'chalk';

const { log } = console;
const childProcesses: {[key: string]: ChildProcessWithoutNullStreams | null} = {};
export function runDev() {
    // NOTE: spawnSync 控制台不会打印子进程日志信息
    const { runDev } = childProcesses;
    if (runDev && runDev.exitCode === null) {
        runDev.on('close', (code, signal) => {
            log(`child process exited: code ${code}, signal: ${signal}`);
            childProcesses.runDev = null;
            handler();
        });
        runDev.kill('SIGTERM');
    } else {
        handler();
    }

    function handler() {
        log(`script: npm run dev`);
        const runDev = spawn('npm', ['run', 'dev']);
        childProcesses.runDev = runDev;
        runDev.stdout.on('data', data => log(`${chalk.bgGreen('stdout')} ${data}`));
        runDev.stderr.on('data', data => log(`${chalk.bgRedBright('stderr')} ${data}`));
    };
}
