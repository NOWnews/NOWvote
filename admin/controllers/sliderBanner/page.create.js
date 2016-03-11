
import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:sliderBanner');

module.exports = function(req, res, next) {
    co(function*() {
        return res.render('sliderBanner/create');
    })
    .catch(next);
}
