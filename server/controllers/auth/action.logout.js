
const debug = require('debug')('NOWvote:server:controllers:auth:action.logout');

module.exports = function(req, res, next) {

    debug('req.session.user = %j', req.session.user);

    req.session.user = null;

    return res.redirect('/');
};
