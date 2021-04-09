// Modules
import { Router } from 'express';
import HomeController from './homeController';

const router = Router();

router.get('/', HomeController.getFn);
router.post('/', HomeController.postFn);
router.all('/', HomeController.allFn);

export default router;
