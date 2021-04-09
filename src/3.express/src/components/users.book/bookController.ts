// Types
import { Request, Response } from 'express';

class BookController {
    getFn1(req: Request, res: Response) {
        console.log('getBookFn1');
        res.send(req.params);
    }
    getFn2(req: Request, res: Response) {
        console.log('getBookFn2');
        res.send(req.params);
    }
}
export default new BookController();
