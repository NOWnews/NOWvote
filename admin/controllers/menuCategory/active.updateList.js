
const debug = require('debug')('NOWvote:admin:controllers:menuCategory:updateList');

import co from 'co';
import Promise from 'bluebird';
import _ from 'lodash';
import models from '../../../models';

module.exports = function(req, res, next) {

    let data = req.body;

    debug('data = %j', data);

    co(function*() {
        // let data = req.body;
        let weightList = req.body.weightList.split(',');
        let statusList = req.body['status[]'];

        let menuCategories = yield models.menuCategory.find()
            .where('trashed').equals(false)
            .execAsync();

        debug('menuCategories = %j', menuCategories);

        debug('statusList = %j', statusList);
        let updatedMenuList = yield Promise.map(menuCategories, function(menuItem) {
            debug('sn = %j', menuItem.sn);

            menuItem.weight = _.indexOf(weightList, menuItem.sn + '');

            if(_.indexOf(statusList, menuItem.sn + '') !== -1){
                debug('menuItem = %j', menuItem);
                menuItem.set('status', true);
                return menuItem.saveAsync();
            }else{
                menuItem.set('status', false);
                return menuItem.saveAsync();
            }
        });

        debug('updatedMenuList = %j', updatedMenuList);

        return res.redirect('/menuCategory');
    })
    .catch(next);

};
