
const debug = require('debug')('NOWvote:admin:controllers:sliderBanner');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {
    co(function*() {
        return res.render('sliderBanner/create');
    })
    .catch(next);
}
