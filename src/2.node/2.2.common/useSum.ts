namespace _ {
    const r = require('./sum.ts');
    const path = require('path');
    /**
     * let r1 = (function() {
     *      module.exports = function(a: number, b: number) {
     *          return a + b;
     *      };
     *      return module.exports;
     *  });
     */


    console.log(r(1, 2));

    console.log(path.basename('1.js', '.js'));
    console.log(path.extname('1.min.js'));
    console.log(__dirname);
    console.log(__filename);
    console.log(path.join('a', 'b'));


    console.log(path.join(__dirname, 'sum.js'));
    console.log(path.resolve(__dirname, 'sum.js'));

    console.log(path.join('sum.js'));
    console.log(path.resolve('sum.js'));

    console.log(path.join(__dirname, 'sum.js', '/'));
    console.log(path.resolve(__dirname, 'sum.js', '/'));

    console.log(path.dirname(__dirname));
}
