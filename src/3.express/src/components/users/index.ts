// Types
import { Express } from 'express';

// Modules
import usersAPI from './usersAPI';

export { usersAPI };

export const Users = (app: Express) => {
    app.use('/users', usersAPI);
};
