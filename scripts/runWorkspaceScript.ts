import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

interface Workspace {
    location: string;
    name: string;
    scripts: { [key: string]: string };
}

const { log } = console;
const ls = spawn('yarn', ['workspaces', 'list', '--json']);
const uniqueProjects: Workspace[]  = [];
ls.stdout.on('data', (data) => {
    const workspaces: Workspace[] = data.toString()
        .split(/\n/)
        .filter(Boolean)
        .map(JSON.parse);
    uniqueProjects.push(...workspaces);
});
ls.on('close', (code) => {
    const codeString = code === 0 ? chalk.green('' + code) : chalk.bold.red('' + code);
    log(`[${codeString}] --------- `);

    uniqueProjects.forEach((item, index) => {
        const packageJSONPath = join(item.location, 'package.json');
        if (!existsSync(packageJSONPath)) return;
        const packageJSON = JSON.parse(readFileSync(packageJSONPath, "utf8"));

        if (!packageJSON.scripts) return;
        item.scripts = packageJSON.scripts;
    });
    commandSelect();
});

ls.stderr.on('data', (error) => {
    console.log(chalk.red('[ERROR]: ') + error);
});


async function commandSelect() {
    const { workspaceName } = await inquirer.prompt([{
        type: 'list',
        name: 'workspaceName',
        message: 'Select a workspace.',
        choices: uniqueProjects
    }]);
    const workspace = uniqueProjects.find(p => p.name === workspaceName);
    if (!workspace) return log(`${chalk.yellow('[WARN]')} The selected workspace does not exist`);
    const { script } = await inquirer.prompt([{
        type: 'list',
        name: 'script',
        message: 'Select a script to run.',
        choices: Object.keys(workspace.scripts)
    }]);

    const prefix = chalk.gray('> ');
    const cmd = chalk.bold(`yarn workspace ${workspaceName} ${script}`);
    log(prefix + cmd);

    spawn(
        'yarn',
        [
            'workspace',
            workspaceName,
            script
        ],
        { stdio: 'inherit' }
    );
}
