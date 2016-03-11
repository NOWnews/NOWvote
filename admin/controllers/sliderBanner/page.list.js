
const debug = require('debug')('NOWvote:admin:controllers:sliderBanner:page.list');

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
        return res.render('sliderBanner/list', {items: items});
    })
    .catch(next);

};
