
import co from 'co';

const debug = require('debug')('NOWvote:server:controllers:type:pageList');

module.exports = function(req, res, next) {

    co(function*() {
        debug('type is %s', req.params.type);
        return res.render('type/list', { type: req.params.type });
    })
    .catch(next);
};