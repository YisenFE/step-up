/**
 * @file path
 */
import path from 'path';

export const _path = (p: string): string => {
    return path.resolve(__dirname, `../txt/${p}`);
};
