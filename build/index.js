"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router_1 = __importDefault(require("./router"));
var app = express_1.default();
app.use(router_1.default);
var port = 7001;
app.listen(port, function () {
    console.log("server is running http://localhost:" + port);
});
