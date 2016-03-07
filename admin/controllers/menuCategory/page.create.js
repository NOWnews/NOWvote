const debug = require('debug')('NOWvote:admin:controllers:menu');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {
    co(function*() {
        return res.render('menuCategory/create');
    })
    .catch(next);
}
