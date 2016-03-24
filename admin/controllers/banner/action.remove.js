
import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:banner:action.remove');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    co(function*() {
        let banner = yield models.banner.findOne()
            .where('sn').equals(sn)
            .execAsync();

        banner.set('trashed', true);
        let removedBanner = yield banner
            .saveAsync();

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('banner');

        return res.json(removedBanner);
    })
    .catch(next);
};
