console.log(this === exports); // true
module.exports = function (a: number, b: number) {
    return a + b;
}
