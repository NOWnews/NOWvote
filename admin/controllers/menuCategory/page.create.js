import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:menu');

module.exports = function(req, res, next) {
    co(function*() {
        return res.render('menuCategory/create');
    })
    .catch(next);
}
