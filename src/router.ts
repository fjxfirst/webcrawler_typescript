import {Router, Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import Crowller from './crowller';
import DouBanAnalyzer from "./DouBanAnalyzer";

//对于experss声明文件不完整解决方案，通过接口继承，这样body便不再是any类型了
interface RequestWithBody extends Request {
    body: {
        // password: string|undefined
        [key: string]: string | undefined
    }
}

const router = Router();
router.get('/', (req: Request, res: Response) => {
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
router.get('/logout', (req: RequestWithBody, res: Response) => {
    const isLogin = req.session ? req.session.login : false;
    if (req.session) {
        req.session.login = undefined;
    }
    res.redirect('/');
});
router.post('/login', (req: RequestWithBody, res: Response) => {
    const isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.send('已经登录');
    } else {
        if (req.body.password === '123' && req.session) {
            req.session.login = true;
            res.send('登录成功');
        } else {
            res.send(`登录失败`);
        }
    }
});
router.get('/getData', (req: RequestWithBody, res: Response) => {
    const isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        const url = 'https://movie.douban.com/chart';  // 爬取豆瓣电影排行榜
        const analyzer = DouBanAnalyzer.getInstance();
        new Crowller(url, analyzer);
        res.send('getData success');
    } else {
        res.send('请先登录再爬取');
    }
});
router.get('/showData', (req: RequestWithBody, res: Response) => {
    try {
        const position = path.resolve(__dirname, '../data/movie.json');
        const result = fs.readFileSync(position, 'utf-8');
        res.json(JSON.parse(result));
    } catch (e) {
        res.send('尚未爬取到内容');
    }

});
export default router;