
const debug = require('debug')('NOWvote:server:controllers:user:page.show');

module.exports = function(req, res, next) {
    return res.render('user/show');
};
