import cheerio from "cheerio";
import fs from "fs";
import {Analyer} from './crowller';
interface Movie {
    movieName: string,
    score: number
}

interface MovieResult {
    time: number,
    data: Movie[]
}

interface Content {
    [propName: number]: Movie[]
}
export default class DouBanAnalyzer implements Analyer{
    private getMovieInfo(html: string) {
        const $ = cheerio.load(html);
        const movies = $('.pl2');
        const movieInfos: Movie[] = [];
        movies.map((index, element) => {
            const movieName = $(element).find('a').text().replace(/\s/g, '');
            const score = Number($(element).find('.rating_nums').text());
            movieInfos.push({movieName, score});
        });
        return {
            time: new Date().getTime(),
            data: movieInfos
        };
    }
    generateJsonContent(movieInfo: MovieResult, filePath: string) {
        let fileContent:Content = {};
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        fileContent[movieInfo.time] = movieInfo.data;
        return fileContent;
    }
    public analyze(html:string, filePath:string){
        const movieInfo = this.getMovieInfo(html);
        const fileContent = this.generateJsonContent(movieInfo, filePath);
        return JSON.stringify(fileContent)
    }
}