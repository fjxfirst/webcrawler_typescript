import {Router, Request, Response} from 'express';
import Crowller from './crowller';
import DouBanAnalyzer from "./DouBanAnalyzer";

const router = Router();
router.get('/', (req: Request, res: Response) => {
    res.send('hello world');
});
router.get('/getData', (req: Request, res: Response) => {
    const url = 'https://movie.douban.com/chart';  // 爬取豆瓣电影排行榜
    const analyzer = DouBanAnalyzer.getInstance();
    new Crowller(url, analyzer);
    res.send('getData success');
});
export default router;