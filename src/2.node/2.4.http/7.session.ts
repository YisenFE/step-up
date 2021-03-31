import http from 'http';
import querystring from 'querystring';
// import uuid from 'uuid';

const session: { [key: string]: any } = {};
const CARD_ID = 'connect.sid';

http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
        res.statusCode = 404;
        return res.end();
    }
    const cookies = querystring.parse(req.headers.cookie || '', '; ') || {};
    let cardNumber = cookies[CARD_ID] as string;
    if (cardNumber && session[cardNumber]) {
        session[cardNumber].mny -= 10;
    } else {
        session[cardNumber = guid()] = { mny: 100 };
        res.setHeader('Set-Cookie', `${CARD_ID}=${cardNumber}`);
    }
    res.setHeader('Content-Type', 'text/html;charset=utf8');
    res.end(`当前您的账户上有 ${session[cardNumber].mny}`);

}).listen(3000, () => {
    console.log('http://localhost:3000');
});



function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
}
