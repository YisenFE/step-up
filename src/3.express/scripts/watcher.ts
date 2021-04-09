/// <reference path="../types/global.d.ts"/>

import chalk from 'chalk';
import { Client } from 'fb-watchman';
import { runDev } from './run';

const { log } = console;
const client = new Client();
const dir_of_interest = process.cwd();

client.capabilityCheck({ optional: [], required: ['relative_root'] }, (error, resp) => {
    if (error) {
        // error will be an Error object if the watchman service is not
        // installed, or if any of the names listed in the `required`
        // array are not supported by the server
        log(error);
        client.end();
        return;
    }

    // Initiate the watch
    client.command(['watch-project', dir_of_interest], (error, resp) => {
        if (error) {
            console.error('Error initiating watch:', error);
            return;
        }

        // It is considered to be best practice to show any 'warning' or
        // 'error' information to the user, as it may suggest steps
        // for remediation
        if ('warning' in resp) {
            console.log('warning: ', resp.warning);
        }

        // `watch-project` can consolidate the watch for your
        // dir_of_interest with another watch at a higher level in the
        // tree, so it is very important to record the `relative_path`
        // returned in resp

        log('watch established on ', resp.watch,
            ' relative_path', resp.relative_path
        );

        make_subscription(client, resp.watch, resp.relative_path);
    });
});

/**
 * 订阅变化
 * @param client create a client instance
 * @param watch `watch` is obtained from `resp.watch` in the `watch-project` response.
 * @param relative_path `relative_path` is obtained from `resp.relative_path` in the `watch-project` response.
 */
function make_subscription(client: Client, watch: string, relative_path: string) {
    const sub = {
        // Match dirname in the dir_of_interest
        expression: ['anyof', ['dirname', 'src'], ['dirname', 'public']],
        // Which fields we're interested in
        fields: ['name', 'size', 'mtime_ms', 'exists', 'type'],
        relative_root: relative_path
    };

    client.command(['subscribe', watch, 'my_subscription', sub], (error, resp) => {
        if (error) {
            // Probably an error in the subscription criteria
            console.error('failed to subscribe: ', error);
            return;
        }
        log(`${chalk.green('success')} connected to Watchman`);
    });

    // Subscription results are emitted via the subscription event.
    // Note that this emits for all subscriptions.  If you have
    // subscriptions with different `fields` you will need to check
    // the subscription name and handle the differing data accordingly.
    // `resp`  looks like this in practice:
    //
    // { root: '/private/tmp/foo',
    //   subscription: 'my_subscription',
    //   files: [ { name: 'node_modules/fb-watchman/index.js',
    //       size: 4768,
    //       exists: true,
    //       type: 'f' } ] }
    client.on('subscription', resp => {
        if (resp.subscription !== 'my_subscription') return;

        resp.files.forEach((file: FileInfo)=> {
            // convert Int64 instance to javascript integer
            const mtime_ms = +file.mtime_ms;

            console.log('file changed: ' + file.name, mtime_ms);
        });
        runDev();
    });
}
