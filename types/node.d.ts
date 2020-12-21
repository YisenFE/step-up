declare var __dirname: string;

type BufferEncoding = "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";

declare module 'fs' {
    export interface BaseEncodingOptions {
        encoding?: BufferEncoding | null;
    }

    export function readFile(path: string, options: { encoding?: null ; flag?: string } | undefined | null, callback: (err: any, data: any) => void): void;
    export function readFile(path: string, options: { encoding: BufferEncoding; flag?: string } | string, callback: (err: any, data: any) => void): void;
    export function readFile(path: string, options: BaseEncodingOptions & { flag?: string; } | string | undefined | null, callback: (err: any, data: any) => void): void;
    export function readFile(path: string, callback: (err: any, data: any) => void): void;
}

declare module 'path' {
    namespace path {
        interface PlatformPath {
            resolve(...pathSegments: string[]): string;
        }
    }
    const path: path.PlatformPath;
    export = path;
}
