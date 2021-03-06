import url from 'url';

const urlObj = url.parse('https://username:password@www.baidu.com:443/index.html?a=1&b=2#abc', true);

console.log(urlObj);
