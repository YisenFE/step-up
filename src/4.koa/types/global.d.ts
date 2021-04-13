import * as Koa from 'koa';
import { ParsedUrlQuery } from 'querystring';
declare module "koa" {
    interface Request extends Koa.BaseRequest {
        body?: ParsedUrlQuery;
    }
}
