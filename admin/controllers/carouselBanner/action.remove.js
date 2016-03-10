
const debug = require('debug')('NOWvote:admin:controllers:carouselBanner:action.remove');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    debug('sn=%s', sn);
    co(function*() {
        debug('sliderBanner= %j', models.sliderBanner);
        let sliderBanner = yield models.sliderBanner.findOne()
            .where('sn').equals(sn)
            .execAsync();

        debug('sliderBanner', sliderBanner);
        sliderBanner.set('trashed', true);
        let removedSliderBanner = yield sliderBanner
            .saveAsync();

        debug('removedSliderBanner = %j', removedSliderBanner);
        return res.json(removedSliderBanner);
    })
    .catch(next);
};
