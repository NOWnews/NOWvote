
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

const upload = multer({ dest: '/tmp' });
const defaultUser = require('./defaultUser');

module.exports = function(app) {

    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
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
    nunjucks.configure('admin/views', { autoescape: true, express: app });

    // 靜態檔案位置
    app.use('/static', express.static(rootPath + '/server/public/'));

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

    app.use(logger('dev'));

    app.use(defaultUser());

    return function(req, res, next) {
        return next();
    };
};
