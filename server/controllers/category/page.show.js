
import co from 'co';

const debug = require('debug')('NOWvote:server:controllers:type:pageShow');

module.exports = function(req, res, next) {

    co(function*() {
        debug('type is %s', req.params.type);
        debug('sn is %s', req.params.sn);
        return res.render('type/show', { type: req.params.type, sn: req.params.sn });
    })
    .catch(next);
};