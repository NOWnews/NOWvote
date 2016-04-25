import express from 'express';
import compression from 'compression';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import cookieSession from 'cookie-session';
import nunjucks from 'nunjucks';
import methodOverride from 'method-override';
import passport from 'passport';

const upload = multer({ dest: '/tmp' });
const auth = require('./auth');
const parseBaseQuery = require('./parseBaseQuery');

module.exports = function(app) {

    app.use(compression());
    app.use(bodyParser.json({
        limit: '50mb'
    }));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '50mb'
    }));
    app.use(cookieParser());
    app.use(cors());
    app.use(upload.single('file'));

    // express session setting
    app.set('trust proxy', 1);
    app.use(cookieSession({
        name: 'vote',
        keys: ['NOWvote', 'vote']
    }));

    // view engine 設定與 views 擺放位置設定
    app.set('view engine', 'html');
    nunjucks.configure('server/views', { autoescape: true, express: app });

    // 靜態檔案位置
    app.use('/static', express.static(rootPath + '/server/public/'));
    app.use('/images', express.static(rootPath + '/imageStorage/'));
    
    // 將前台網址加入 locals 給 og 用
    app.use(function(req, res, next) {
        res.locals.serviceUrl = config.webSite.serviceUrl;
        return next();
    })

     // TODO 暫時用此方法引入 foundation
    app.use('/bower', express.static(rootPath + '/bower_components/'));

    // overwrite put and delete method
    app.use(methodOverride(function(req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));

    app.use(auth(app));

    app.use(logger('dev'));

    // 處理 get query limit, skip 的問題
    app.use(parseBaseQuery());

    return function(req, res, next) {
        return next();
    };
};
