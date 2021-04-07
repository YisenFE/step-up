import { spawn } from 'child_process';
import chalk from 'chalk';

const { log } = console;
export function runBootstrap() {
    // NOTE: spawnSync 控制台不会打印日志信息
    const runBootstrap = spawn('npm', ['run', 'bootstrap']);
    runBootstrap.stdout.on('data', data => log(`${chalk.bgGreen('stdout:')} ${data}`));
    runBootstrap.stderr.on('data', data => log(`${chalk.bgRed('stderr:')} ${data}`));
    runBootstrap.on('close', code => log(`child process exited with code ${code}`));
}
