import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:content:action.create');

module.exports = function(req, res, next) {

    let data = req.body;
    debug('req body = %j', data);

    co(function*() {

        let status = data.status ? true : false;
        let startTime = moment( `${data.startAtDay} ${data.startAtHour}` );
        let endTime = moment( `${data.endAtDay} ${data.endAtHour}` );
        let newcontent = yield models.content.createAsync({
            title: data.title,
            desc: data.desc,
            url: data.url,
            startTime: startTime,
            endTime: endTime,
            status: status
        });

        debug('new menu category = %j', newcontent);

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('');

        return res.redirect('/content');
    })
    .catch(next);
};
