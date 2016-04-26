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

        let categories = yield models.category.find()
            .where('trashed').equals(false)
            .execAsync();

        let updatedMenuList = yield Promise.map(categories, function(menuItem) {
            let index = _.indexOf(weightList, String(menuItem.sn));

            menuItem.weight = index === -1 ? menuItem.weight: index;

            if(_.indexOf(statusList, String(menuItem.sn)) !== -1){
                menuItem.set('status', true);
                return menuItem.saveAsync();
            }else{
                menuItem.set('status', false);
                return menuItem.saveAsync();
            }
        });

        debug('updatedMenuList = %j', updatedMenuList);

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('category');

        return res.redirect('/category');
    })
    .catch(next);

};
