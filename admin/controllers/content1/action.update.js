import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:menu:content:action.update');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    let data = req.body;

    co(function*() {

        let status = data.status ? true : false;
        let startTime = moment( `${data.startAtDay} ${data.startAtHour}` );
        let endTime = moment( `${data.endAtDay} ${data.endAtHour}` );

        let content = yield models.content.findOne()
            .where('sn').equals(sn)
            .execAsync();

        content.set('title', data.title);
        content.set('url', data.url);
        content.set('desc', data.desc);
        content.set('startTime', startTime);
        content.set('endTime', endTime);
        content.set('status', status);

        yield content.saveAsync();

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('');

        return res.redirect('/content');
    })
    .catch(next);

};
