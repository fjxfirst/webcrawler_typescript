import {Router, Request, Response} from 'express';

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
    res.send(`
    <html>
        <body>
            <form method="post" action="/getData">
                <input type="password" name="password"/>
                <button>提交</button>
            </form>
        </body>
    </html>  
`);
});

router.post('/getData', (req: RequestWithBody, res: Response) => {
    if (req.body.password === '123') {
        const url = 'https://movie.douban.com/chart';  // 爬取豆瓣电影排行榜
        const analyzer = DouBanAnalyzer.getInstance();
        new Crowller(url, analyzer);
        res.send('getData success');
    } else {
        res.send(`${req.teacherName}password error`);
    }

});
export default router;