/**
 * @file 模块
 * 模块的规范（加了函数）
 * 1) 一个文件就是一个模块
 * 2) 每个文件都可以导出自己 module.exports
 * 3) 别人想用这个模块可以引入进来 require
 *
 * 命名冲突 单例模式（可以把自己的代码放到特定对象里维护） 不能完美解决这个问题，而且还会导致调用时代码过长
 * 自执行函数 可以解决模块化的问题
 */


// 模块查找机制
// 1. package.json main值
// 2. module.paths
console.log(module.paths)
