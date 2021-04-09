// Types
import { Express } from 'express';

// Modules
import homeAPI from './homeAPI';
import { HomeMiddleware } from './homeMiddleware';

export { homeAPI };

export const Home = (app: Express) => {
    new HomeMiddleware('^/$', app);
    app.use('/', homeAPI);
};
