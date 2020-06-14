//typescript直接引用JavaScript会有问题，这时候需要.d.ts翻译文件
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import DouBanAnalyzer from './DouBanAnalyzer'

export interface Analyer {
    analyze:(html: string, filePath: string)=>string
}

class Crowller {
    private filePath = path.resolve(__dirname, '../data/movie.json');

    constructor(private url: string, private analyzer: Analyer) {
        this.initSpiderProcess();
    }

    private async getRawHtml() {
        const result = await superagent.get(this.url); // 发送请求，获取页面
        return result.text;
    }


    private writeFile(content: string) {
        fs.writeFileSync(this.filePath, content);
    }

    private async initSpiderProcess() {
        const html = await this.getRawHtml();
        const fileContent = this.analyzer.analyze(html, this.filePath);
        this.writeFile(fileContent);
    }
}
const url = 'https://movie.douban.com/chart';  // 爬取豆瓣电影排行榜
const analyzer = DouBanAnalyzer.getInstance();
const crowller = new Crowller(url ,analyzer);