import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:menuCategory:action.remove');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let menuCategory = yield models.menuCategory.findOne()
            .where('sn').equals(sn)
            .execAsync();

        menuCategory.set('trashed', true);
        let removedMenuCategory = yield menuCategory
            .saveAsync();

        debug('removedMenuCategory = %j', removedMenuCategory);

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('menuCategory');

        return res.json(removedMenuCategory);
    })
    .catch(next);

};
