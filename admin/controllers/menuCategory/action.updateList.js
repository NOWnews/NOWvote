import co from 'co';
import Promise from 'bluebird';
import _ from 'lodash';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:menuCategory:action.updateList');

module.exports = function(req, res, next) {

    let data = req.body;

    co(function*() {
        let weightList = data.weightList.split(',');
        let statusList = _.isArray(data['status[]']) ? data['status[]'] : [data['status[]']];

        let menuCategories = yield models.menuCategory.find()
            .where('trashed').equals(false)
            .execAsync();

        let updatedMenuList = yield Promise.map(menuCategories, function(menuItem) {
            let weight = _.indexOf(weightList, String(menuItem.sn));

            menuItem.weight = weight === -1 ? menuItem.weight: weight;

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
        yield redis.updateRedisByKey('categoryMenu');

        return res.redirect('/menuCategory');
    })
    .catch(next);

};
