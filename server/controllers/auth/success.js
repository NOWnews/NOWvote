
const debug = require('debug')('NOWvote:server:controllers:auth:success');

module.exports = function(req, res, next) {
    debug('req session user = %j', req.session.user);
    return res.send('success');
};