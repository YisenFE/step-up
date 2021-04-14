import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import chalk from 'chalk';

const { log } = console;
const childProcesses: {[key: string]: ChildProcessWithoutNullStreams | null} = {};

export function runDev() {
    // NOTE: spawnSync 控制台不会打印子进程日志信息
    const { runDev } = childProcesses;
    if (runDev && runDev.exitCode === null) {
        runDev.on('close', restart);
        runDev.kill('SIGTERM');
    } else {
        restart();
    }

    function restart() {
        log(`${chalk.green('restart')} npm run dev`);
        const runDev = spawn('npm', ['run', 'dev']);
        childProcesses.runDev = runDev;
        runDev.stdout.on('data', data => log(`${chalk.bgGreen('stdout')} ${data}`));
        runDev.stderr.on('data', data => log(`${chalk.bgRedBright('stderr')} ${data}`));
        runDev.on('exit', (code, signal) => log(`${chalk.redBright('child process exited')} code ${code}, signal: ${signal}`));
    };
}
