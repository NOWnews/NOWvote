
const debug = require('debug')('NOWvote:server:controllers:user:page.myIssues');

module.exports = function(req, res, next) {
    return res.render('user/meIssues');
};
