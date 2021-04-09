// Types
import { Request, Response } from 'express';

class UsersController {
    getFn1(req: Request, res: Response) {
        console.log('getUsersFn1');
        res.send(req.params);
    }
    getFn2(req: Request, res: Response) {
        console.log('getUsersFn2');
        res.send(req.params);
    }
}
export default new UsersController();
