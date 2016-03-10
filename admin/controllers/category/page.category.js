
const debug = require('debug')('NOWvote:admin:controllers:category');

import co from 'co';
import models from '../../../models';


module.exports = function(req, res, next) {
    co(function*() {
        return res.render('category');
    })
    .catch(next);
}
