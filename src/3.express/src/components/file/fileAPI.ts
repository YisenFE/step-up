// Modules
import { Router } from 'express';
import FileController from './fileController';

const router = Router();

router.get('/root/:name', FileController.getFile);

export default router;
