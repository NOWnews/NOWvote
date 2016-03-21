
import co from 'co';

const debug = require('debug')('NOWvote:admin:middlewares:isLogin');

module.exports = function(req, res, next) {

    debug('req.session.adminUser = %j', req.session.adminUser);

    if(!req.session || !req.session.adminUser) {
        return res.redirect('/auth/login');
    }

    return next();
};