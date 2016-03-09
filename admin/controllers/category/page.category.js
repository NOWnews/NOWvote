
const debug = require('debug')('NOWvote:admin:controllers:carouselBanner');

import co from 'co';
import models from '../../../models';


module.exports = function(req, res, next) {
    co(function*() {
        return res.render('carouselBanner/create');
    })
    .catch(next);
}
