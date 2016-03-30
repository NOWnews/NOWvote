
const debug = require('debug')('NOWvote:server:controllers:auth:fail');

module.exports = function(req, res, next) {
    return res.send('fail');
};
