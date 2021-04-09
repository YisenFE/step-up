// Modules
import { Router } from 'express';
import BookController from './bookController';

const router = Router();

router.get('/aaa/:bookId', BookController.getFn1);
router.get('/bbb/:aa/:bb', BookController.getFn2);

export default router;
