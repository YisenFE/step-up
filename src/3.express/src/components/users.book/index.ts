// Types
import { Express } from 'express';

// Modules
import bookAPI from './bookAPI';
import { usersAPI } from '../users';

export { bookAPI };

export const UsersBook = (app: Express) => {
    usersAPI.use('/:userId', bookAPI);
};
