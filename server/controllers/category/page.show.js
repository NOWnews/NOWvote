
import co from 'co';

const debug = require('debug')('NOWvote:server:controllers:category:page.show');

module.exports = function(req, res, next) {

    co(function*() {
        debug('category is %s', req.params.category);
        debug('sn is %s', req.params.sn);
        return res.render('category/show', { category: req.params.category, sn: req.params.sn });
    })
    .catch(next);
};
