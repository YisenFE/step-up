import { Promise } from './promise';

export const deferred = function() {
    const dfd: {
        promise?: Promise<unknown>;
        resolve?: (value: unknown) => void;
        reject?: (reason?: any) => void;
    } = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
export default {

}
