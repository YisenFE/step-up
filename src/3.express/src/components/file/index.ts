// Types
import { Express } from 'express';

// Modules
import fileAPI from './fileAPI';
import { FileMiddleware } from './fileMiddleware';

export { fileAPI };

export const File = (app: Express) => {
    new FileMiddleware('/file', app);
    app.use('/file', fileAPI);
};
