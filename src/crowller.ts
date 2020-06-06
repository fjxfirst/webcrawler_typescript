//typescript直接引用JavaScript会有问题，这时候需要.d.ts繁育文件
import superagent from 'superagent';
import cheerio from 'cheerio';

interface movie {
    movieName: string,
    score: number
}

class Crowller {
    private secret = 'secretKey';
    private url = 'https://movie.douban.com/chart'; // 爬取豆瓣电影排行榜

    getMovieInfo(html: string) {
        const $ = cheerio.load(html);
        const movies = $('.pl2');
        const movieInfos: movie[] = [];
        movies.map((index, element) => {
            const movieName = $(element).find('a').text().replace(/\s/g, '');
            const score = Number($(element).find('.rating_nums').text());
            movieInfos.push({movieName, score});
        });
        const result = {
            time: new Date().getTime(),
            data:movieInfos
        }
        console.log(result);
    }

    async getRawHtml() {
        try {
            const result = await superagent.get(this.url); // 发送请求，获取页面
            this.getMovieInfo(result.text);
        } catch (e) {
            console.log(e);
        }

    }

    constructor() {
        this.getRawHtml();
    }

}

const crowller = new Crowller();