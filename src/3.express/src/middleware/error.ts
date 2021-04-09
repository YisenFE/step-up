// Types
import { Express, Request, Response, NextFunction } from 'express';

/**
 * 错误处理
 */
export class MiddlewareError {
    constructor(app: Express) {
        app.use(this.handler);
    }
    handler(err: Error, req: Request, res: Response, next: NextFunction) {
        console.error('logError: ', err);
        next(err);
    }
}
