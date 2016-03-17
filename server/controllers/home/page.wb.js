const debug = require('debug')('NOWvote:server:controllers:wb');

module.exports = function(req, res, next) {
    return res.render('wb');
};
