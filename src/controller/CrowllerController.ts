import path from "path";
import fs from "fs";
import 'reflect-metadata';
import {NextFunction, Request, Response} from "express";
import {controller, use, get} from '../decorator';
import {getResPonseData} from "../utils/util";
import DouBanAnalyzer from "../utils/DouBanAnalyzer";
import Crowller from "../utils/crowller";


//对于experss声明文件不完整解决方案，通过接口继承，这样body便不再是any类型了
interface BodyRequest extends Request {
    body: {
        [key: string]: string | undefined
    }
}

//提取公共逻辑中间件
const checkLogin = (req: BodyRequest, res: Response, next: NextFunction):void => {
    const isLogin = !!(req.session ? req.session.login : false);
    if (isLogin) {
        next();
    } else {
        res.json(getResPonseData(null, '请先登录'));
    }
};

@controller('/')
export class CrowllerController {
    @get('/getData')
    @use(checkLogin)
    getData(req: BodyRequest, res: Response):void {
        const url = 'https://movie.douban.com/chart';  // 爬取豆瓣电影排行榜
        const analyzer = DouBanAnalyzer.getInstance();
        new Crowller(url, analyzer);
        res.json(getResPonseData(true));
    }

    @get('/showData')
    @use(checkLogin)
    showData(req: BodyRequest, res: Response):void {
        try {
            const position = path.resolve(__dirname, '../../data/movie.json');
            const result = fs.readFileSync(position, 'utf-8');
            res.json(getResPonseData(JSON.parse(result)));
        } catch (e) {
            res.json(getResPonseData(false, '数据不存在'));
        }
    }
}