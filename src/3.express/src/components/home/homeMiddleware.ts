import { Express, Request, Response, NextFunction } from 'express';
type Prop = 'constructor' | keyof HomeMiddleware;
/**
 * 中间件
 */
export class HomeMiddleware {
    constructor(path: string, app: Express) {
        const proto: HomeMiddleware = Object.getPrototypeOf(this);
        const props = Object.getOwnPropertyNames(proto) as Prop[];
        props.forEach(
            (prop: Prop) => prop !== 'constructor' && app.use(path, this[prop])
        );
    }
    fn1(req: Request, res: Response, next: NextFunction) {
        console.log(1);
        next('xxx');
        console.log(4);
    }
    fn2(req: Request, res: Response, next: NextFunction) {
        console.log(2);
        next();
        console.log(5);
    }
    fn3(req: Request, res: Response, next: NextFunction) {
        console.log(3);
        next();
        console.log(6);
    }
}
