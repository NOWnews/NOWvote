
import co from 'co';
import Promise from 'bluebird';
import _ from 'lodash';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:category:action.updateList');

module.exports = function(req, res, next) {

    let data = req.body;

    co(function*() {
        let weightList = data.weightList.split(',');
        let statusList = _.isArray(data['status[]']) ? data['status[]'] : [data['status[]']];

        // TODO 目前不知道為什麼前端 name 丟 status[], 後端接到 name 變成 status, 暫時這樣處理
        if(data.status){
            statusList = _.isArray(data.status) ? data.status : [data.status];
        }

        let banner = yield models.banner.find()
            .where('trashed').equals(false)
            .execAsync();

        let updateBannerList = yield Promise.map(banner, function(bannerItem) {
            let index = _.indexOf(weightList, String(bannerItem.sn));
            bannerItem.weight = index === -1 ? bannerItem.weight: index;

            if(_.indexOf(statusList, String(bannerItem.sn)) !== -1){
                bannerItem.set('status', true);
                return bannerItem.saveAsync();
            }else{
                bannerItem.set('status', false);
                return bannerItem.saveAsync();

            }
        });
        // return res.status(204).send();

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('banner');

        return res.redirect('/banner');
    })
    .catch(next);

};
