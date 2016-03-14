import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:content:action.remove');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let content = yield models.content.findOne()
            .where('sn').equals(sn)
            .execAsync();

        content.set('trashed', true);
        let removedcontent = yield content
            .saveAsync();

        debug('removedcontent = %j', removedcontent);

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('');

        return res.json(removedcontent);
    })
    .catch(next);

};
