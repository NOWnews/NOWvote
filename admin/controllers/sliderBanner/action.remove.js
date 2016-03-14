
import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

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

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('sliderBanner');

        return res.json(removedSliderBanner);
    })
    .catch(next);
};
