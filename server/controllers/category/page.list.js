
import co from 'co';

const caches = require('../../../caches');

const debug = require('debug')('NOWvote:server:controllers:category:page.list');

module.exports = function(req, res, next) {

    co(function*() {
        debug('type is %s', req.params.type);
        let menu = yield caches.getCategory();
        return res.render('category/list', { type: req.params.type, menu: menu });
    })
    .catch(next);
};
