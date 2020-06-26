import 'reflect-metadata';
import {Request, Response} from "express";
import {controller,get ,post} from "../decorator";
import {getResPonseData} from "../utils/util";

//对于experss声明文件不完整解决方案，通过接口继承，这样body便不再是any类型了
interface BodyRequest extends Request {
    body: {
        [key: string]: string | undefined
    }
}


@controller('/api')
export class LoginController {
    static isLogin(req:BodyRequest):boolean{
        return !!(req.session ? req.session.login : false);
    }
    @get('/isLogin')
    isLogin(req: BodyRequest, res: Response):void {
        const isLogin = LoginController.isLogin(req);
        res.json(getResPonseData(isLogin));
    }
    @post('/login')
    login(req: BodyRequest, res: Response):void {
        const isLogin = LoginController.isLogin(req);
        if (isLogin) {
            res.json(getResPonseData(true));
        } else {
            if (req.body.password === '123' && req.session) {
                req.session.login = true;
                res.json(getResPonseData(true));
            } else {
                res.json(getResPonseData(false, '登录失败'));
            }
        }
    }

    @get('/logout')
    logout(req: BodyRequest, res: Response):void {
        if (req.session) {
            req.session.login = undefined;
        }
        res.json(getResPonseData(true));
    }

    @get('/')
    home(req: BodyRequest, res: Response):void {
        const isLogin = LoginController.isLogin(req);
        if (isLogin) {
            res.send(`
            <html>
                <body>
                    <a href="/getData">爬取数据</a>
                    <a href="/showData">展示数据</a>
                    <a href="/logout">退出登录</a>
                </body>
            </html>  
        `);
        } else {
            res.send(`
            <html>
                <body>
                    <form method="post" action="/login">
                        <input type="password" name="password"/>
                        <button>提交</button>
                    </form>
                </body>
            </html>  
        `);
        }
    }
}