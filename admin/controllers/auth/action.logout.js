
const debug = require('debug')('NOWvote:admin:controllers:auth:action.logout');

module.exports = function(req, res, next) {

    debug('req.session.adminUser = %j', req.session.adminUser);

    req.session = null;

    return res.redirect('/auth/login');
};