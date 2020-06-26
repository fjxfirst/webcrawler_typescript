import {CrowllerController, LoginController} from '../controller';

export enum Methods {
    get = 'get',
    post = 'post'
}


function getRequestDecorator(type: Methods) {
    return function (path: string) {
        return function (target: CrowllerController | LoginController, key: string) {
            // 元数据，表示吧path的值存到target的key上
            Reflect.defineMetadata('path', path, target, key);
            Reflect.defineMetadata('method', type, target, key);
        };
    };
}

export const get = getRequestDecorator(Methods.get);
export const post = getRequestDecorator(Methods.post);