
import co from 'co';

const debug = require('debug')('NOWvote:server:middlewares:isLogin');
const libs = require('../../libs');

module.exports = function(req, res, next) {

    debug('req.session.user = %j', req.session.user);

    if(!req.session || !req.session.user) {
        let err = libs.errorWrapper(10403, '這個操作必需要登入唷', 'json', new Error());
        return next(err);
    }

    return next();
};