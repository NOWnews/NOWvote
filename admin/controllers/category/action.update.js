import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:menu:menuCategory:action.update');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    let data = req.body;

    co(function*() {

        let status = data.status ? true : false;
        let continued = data.continued ? true : false;
        let startTime, endTime;

        // 如果常駐被勾起來，就不需要記錄時間
        if(continued){
            startTime = 0;
            endTime = 0;
        }else{
            startTime = moment( `${data.startAtDay} ${data.startAtHour}` );
            endTime = moment( `${data.endAtDay} ${data.endAtHour}` );
        }

        let menuCategory = yield models.menuCategory.findOne()
            .where('sn').equals(sn)
            .execAsync();

        menuCategory.set('title', data.title);
        menuCategory.set('url', data.url);
        menuCategory.set('desc', data.desc);
        menuCategory.set('startTime', startTime);
        menuCategory.set('endTime', endTime);
        menuCategory.set('status', status);
        menuCategory.set('continued', continued);

        yield menuCategory.saveAsync();

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('menuCategory');

        return res.redirect('/menuCategory');
    })
    .catch(next);

};
