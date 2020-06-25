import express, {Request, NextFunction, Response} from 'express';
import bodyParser from 'body-parser';
import router from './router';

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use((req: Request, res: Response, next: NextFunction) => {
    //当往req对象新添加属性时，由于声明文件中没有对应的属性，所以会报错,这时需要类型融合
    req.teacherName = 'tom';
    next();
});
app.use(router);
const port = 7001;
app.listen(port, () => {
    console.log(`server is running http://localhost:${port}`);
});