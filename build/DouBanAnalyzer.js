"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var DouBanAnalyzer = /** @class */ (function () {
    function DouBanAnalyzer() {
    }
    DouBanAnalyzer.getInstance = function () {
        if (!DouBanAnalyzer.instance) {
            DouBanAnalyzer.instance = new DouBanAnalyzer();
        }
        return DouBanAnalyzer.instance;
    };
    DouBanAnalyzer.prototype.getMovieInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var movies = $('.pl2');
        var movieInfos = [];
        movies.map(function (index, element) {
            var movieName = $(element).find('a').text().replace(/\s/g, '');
            var score = Number($(element).find('.rating_nums').text());
            movieInfos.push({ movieName: movieName, score: score });
        });
        return {
            time: new Date().getTime(),
            data: movieInfos
        };
    };
    DouBanAnalyzer.prototype.generateJsonContent = function (movieInfo, filePath) {
        var fileContent = {};
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[movieInfo.time] = movieInfo.data;
        return fileContent;
    };
    DouBanAnalyzer.prototype.analyze = function (html, filePath) {
        var movieInfo = this.getMovieInfo(html);
        var fileContent = this.generateJsonContent(movieInfo, filePath);
        return JSON.stringify(fileContent);
    };
    return DouBanAnalyzer;
}());
exports.default = DouBanAnalyzer;
