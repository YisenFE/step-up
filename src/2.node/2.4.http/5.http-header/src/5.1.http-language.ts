/// <reference path="../types/5.1.d.ts" />
import http, { IncomingMessage, ServerResponse } from 'http';

const LANGUAGES: Languages = {
    'zh-CN': '你好',
    'en': 'hello'
};
const DEFAULT_LANGUAGE = 'zh-CN';
//# curl -v --header "Accept-Language:zh-CN,zh;q=0.9,en;q=0.8" http://localhost:3000
//# curl -v http://localhost:3000
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-type', 'text/plain;charset=utf8');
    const content = responseContent(req.headers['accept-language']);
    res.end(content);
});

server.listen(3000, () => {
    console.log('http://localhost:3000');
});

function responseContent(language: AcceptLanguage) {
    if (language) {
        let lanCfg: LanguageWeightConfig[] = language.split(',')
            .map(lan => {
                const [l, q = 'q=1'] = lan.split(';');
                return { lan: l, q: Number(q.split('=')[1]) };
            })
            .sort((a: LanguageWeightConfig, b: LanguageWeightConfig) => b.q - a.q);
        for (let i = 0; i < lanCfg.length; i++) {
            const curr = LANGUAGES[lanCfg[i].lan];
            if (curr) {
                return curr;
            }
        }
    }
    return LANGUAGES[DEFAULT_LANGUAGE];
}
