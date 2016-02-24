
import co from 'co';

const debug = require('debug')('NOWvote:server:controllers:tag:pageList');

module.exports = function(req, res, next) {

    co(function*() {
        debug('tag is %s', req.params.tag);
        return res.render('type/list', { tag: req.params.tag });
    })
    .catch(next);
};