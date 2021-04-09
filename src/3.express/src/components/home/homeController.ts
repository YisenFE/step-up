// Types
import { Request, Response } from 'express';

class HomeController {
    getFn(req: Request, res: Response) {
        res.send('get: Hello World!');
    }
    postFn(req: Request, res: Response) {
        res.send('post: Hello World!');
    }
    allFn(req: Request, res: Response) {
        res.send('all: Hello World!');
    }
}
export default new HomeController();
