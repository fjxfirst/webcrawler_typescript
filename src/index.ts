import express from 'express';
import router from './router';

const app = express();
app.use(router);
const port = 7001;
app.listen(port, () => {
    console.log(`server is running http://localhost:${port}`);
});