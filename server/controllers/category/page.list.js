
import co from 'co';

const caches = require('../../../caches');

const debug = require('debug')('NOWvote:server:controllers:category:pageList');

module.exports = function(req, res, next) {

    co(function*() {
        debug('type is %s', req.params.type);
        let menu = yield caches.getMenuCategory();
        return res.render('category/list', { type: req.params.type, menu: menu });
    })
    .catch(next);
};