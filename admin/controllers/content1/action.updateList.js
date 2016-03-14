import co from 'co';
import Promise from 'bluebird';
import _ from 'lodash';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:content:action.updateList');

module.exports = function(req, res, next) {

    let data = req.body;

    co(function*() {
        let weightList = req.body.weightList.split(',');
        let statusList = _.isArray(req.body['status[]']) ? req.body['status[]'] : [req.body['status[]']];

        let menuCategories = yield models.content.find()
            .where('trashed').equals(false)
            .execAsync();

        let updatedMenuList = yield Promise.map(menuCategories, function(menuItem) {

            menuItem.weight = _.indexOf(weightList, menuItem.sn + '');

            if(_.indexOf(statusList, menuItem.sn + '') !== -1){
                menuItem.set('status', true);
                return menuItem.saveAsync();
            }else{
                menuItem.set('status', false);
                return menuItem.saveAsync();
            }
        });

        debug('updatedMenuList = %j', updatedMenuList);

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('');

        return res.redirect('/content');
    })
    .catch(next);

};
