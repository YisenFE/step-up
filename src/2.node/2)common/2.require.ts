/**
 * @file 实现require
 */

import fs from "fs";
import vm from 'vm';
import path from 'path';
namespace _ {
    interface Module {
        load(): void;
    }
    interface ModuleConstructor {
        new(id: string): Module;
        _extensions: {
            '.js'(module: Module): void;
            '.json'(module: Module): void;
            [key: string]: (module: Module) => void;
        }
    }
    class Module implements Module {
        exports = {};
        constructor(public id: string) {}

        public load(this: Module) {
            const extname = path.extname(this.id) || '.js';
            const M: ModuleConstructor = Object.getPrototypeOf(this).constructor;
            M._extensions[extname](this);
        }

        public static _extensions = {
            '.js'(module: Module) {
                let content = fs.readFileSync(module.id, 'utf8');
                const scriptContent = Module.wrapper[0] + content + Module.wrapper[1];
                const fn = vm.runInThisContext(scriptContent);
                fn.call(module.exports, module.exports, module, req);
            },
            '.json'(module: Module) {
                let content = fs.readFileSync(module.id, 'utf8');
                content = JSON.parse(content);
                module.exports = content;
            }
        };

        public static wrapper = [
            '(function(exports, module, require, __dirname, __filename) {',
            '})'
        ];
    }
    function req(id: string) {
        const absPath = path.resolve(__dirname, id);
        const module = new Module(absPath);
        module.load();
        return module.exports;
    }
    const r = req('./sum.json');
}
