// Types
import { Express } from 'express';

// Modules
import fileAPI from './fileAPI';

export { fileAPI };

export const File = (app: Express) => {
    app.use('/file', fileAPI);
};
