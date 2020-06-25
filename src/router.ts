import {Router, Request, Response, NextFunction} from 'express';
import fs from 'fs';
import path from 'path';
import Crowller from './utils/crowller';
import DouBanAnalyzer from "./utils/DouBanAnalyzer";
import {getResPonseData} from './utils/util';

//对于experss声明文件不完整解决方案，通过接口继承，这样body便不再是any类型了
interface BodyRequest extends Request {
    body: {
        // password: string|undefined
        [key: string]: string | undefined
    }
}

//提取公共逻辑中间件
const checkLogin = (req: BodyRequest, res: Response, next: NextFunction) => {
    const isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        next();
    } else {
        res.json(getResPonseData(null, '请先登录'));
    }
};
const router = Router();
router.get('/', (req: BodyRequest, res: Response) => {
    const isLogin = req.session ? req.session.login : false;
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
});
router.get('/logout', (req: BodyRequest, res: Response) => {
    const isLogin = req.session ? req.session.login : false;
    if (req.session) {
        req.session.login = undefined;
    }
    res.json(getResPonseData(true));
});
router.post('/login', (req: BodyRequest, res: Response) => {
    const isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.send('已经登录');
    } else {
        if (req.body.password === '123' && req.session) {
            req.session.login = true;
            res.json(getResPonseData(true));
        } else {
            res.json(getResPonseData(false, '登录失败'));
        }
    }
});
router.get('/getData', checkLogin, (req: BodyRequest, res: Response) => {
    const url = 'https://movie.douban.com/chart';  // 爬取豆瓣电影排行榜
    const analyzer = DouBanAnalyzer.getInstance();
    new Crowller(url, analyzer);
    res.json(getResPonseData(true));
});
router.get('/showData', checkLogin, (req: BodyRequest, res: Response) => {
    try {
        const position = path.resolve(__dirname, '../data/movie.json');
        const result = fs.readFileSync(position, 'utf-8');
        res.json(getResPonseData(JSON.parse(result)));
    } catch (e) {
        res.json(getResPonseData(false, '数据不存在'));
    }
});
export default router;