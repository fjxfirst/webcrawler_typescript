import {RequestHandler} from "express";
import {CrowllerController, LoginController} from '../controller';
export function use(middleware: RequestHandler) {
    return function (target: CrowllerController|LoginController, key: string) {
        const originMiddleWares = Reflect.getMetadata('middlewares',target,key)||[];
        originMiddleWares.push(middleware)
        Reflect.defineMetadata('middlewares', originMiddleWares, target, key);
    };
}