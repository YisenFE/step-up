// Types
import { Request, Response, NextFunction } from 'express';

class FileController {
    getFile(req: Request, res: Response, next: NextFunction) {
        const options = {
            root: `${process.cwd()}/public`,
            /**
             * dotfiles: 如何处理以.开头的文件如.bash
             *  'allow'  - 不做任何特殊处理
             *  'deny'   - 拒接处理，并返回403，然后调用next()
             *  'ignore' - 默认值，认为文件不存在，返回404，然后调用next()
             */
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        }
        const fileName = req.params.name
        res.sendFile(fileName, options, (err) => {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', fileName);
            }
        });
    }
}
export default new FileController();
