import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:category:action.remove');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let category = yield models.category.findOne()
            .where('sn').equals(sn)
            .execAsync();

        category.set('trashed', true);
        let removedCategory = yield category
            .saveAsync();

        debug('removedCategory = %j', removedCategory);

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('category');

        return res.json(removedCategory);
    })
    .catch(next);

};
