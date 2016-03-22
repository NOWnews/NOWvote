
const debug = require('debug')('NOWvote:admin:controllers:issue:page.create');

module.exports = function(req, res, next) {
    return res.render('issue/create');
};
