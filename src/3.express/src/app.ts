/**
 * express 大 功能全 集成路由的功能，还集成了内置方法
 * koa 小 + 插件
 * egg 基于 koa
 */
// Modules
import express from 'express';

import * as Components from './components';
import { MiddlewareError } from './middleware/error';

const app = express();
const port = 3000;

// 注册路由
(function launchComponents(subApps: any) {
    for (const key in subApps) {
        const subApp = subApps[key];
        console.log(subApp);
        subApp(app);
    }
})(Components);

// 注册中间件
new MiddlewareError(app);

// 监听服务
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

