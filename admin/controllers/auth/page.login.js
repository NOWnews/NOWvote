
const debug = require('debug')('NOWvote:admin:controllers:auth:page.login');

module.exports = function(req, res, next) {
    return res.render('auth/login');
};