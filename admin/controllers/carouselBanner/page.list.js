
const debug = require('debug')('NOWvote:admin:controllers:carouselBanner:page.list');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    co(function*() {

        let sliderBanner = yield models.sliderBanner.find().execAsync();
        debug('sliderBanner = %j', sliderBanner);
        let items = yield models.sliderBanner.find()
            .where('trashed').equals(false)
            .sort({weight: 1})
            .execAsync();
        return res.render('carouselBanner/list', {items: items});
    })
    .catch(next);

};
