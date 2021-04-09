// Modules
import { Router } from 'express';
import UsersController from './usersController';

const router = Router();

router.get('/:userId', UsersController.getFn1);
router.get('/nihaoya', UsersController.getFn2);

export default router;
