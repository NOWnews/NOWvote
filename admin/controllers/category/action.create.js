import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:category:action.create');

module.exports = function(req, res, next) {

    let data = req.body;
    debug('req body = %j', data);

    co(function*() {

        let status = data.status ? true : false;
        let continued = data.continued ? true : false;
        let externalLink = data.externalLink ? true : false;
        let startTime, endTime;

        // 如果常駐被勾起來，就不需要記錄時間
        if(continued){
            startTime = 0;
            endTime = 0;
        }else{
            startTime = moment( `${data.startAtDay} ${data.startAtHour}` );
            endTime = moment( `${data.endAtDay} ${data.endAtHour}` );
        }

        let newCategory = yield models.category.createAsync({
            title: data.title,
            desc: data.desc,
            url: data.url,
            startTime: startTime,
            endTime: endTime,
            status: status,
            continued: continued,
            externalLink: externalLink
        });

        debug('new menu category = %j', newCategory);

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('category');

        return res.redirect('/category');
    })
    .catch(next);
};
