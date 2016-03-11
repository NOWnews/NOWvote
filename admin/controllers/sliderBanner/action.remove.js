
import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:sliderBanner:action.remove');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    co(function*() {
        let sliderBanner = yield models.sliderBanner.findOne()
            .where('sn').equals(sn)
            .execAsync();

        sliderBanner.set('trashed', true);
        let removedSliderBanner = yield sliderBanner
            .saveAsync();
        return res.json(removedSliderBanner);
    })
    .catch(next);
};
