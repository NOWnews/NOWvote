import co from 'co';
import Promise from 'bluebird';
import _ from 'lodash';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:menuCategory:action.updateList');

module.exports = function(req, res, next) {

    let data = req.body;

    co(function*() {
        let weightList = req.body.weightList.split(',');
        let statusList = _.isArray(req.body['status[]']) ? req.body['status[]'] : [req.body['status[]']];

        let menuCategories = yield models.menuCategory.find()
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

        return res.redirect('/menuCategory');
    })
    .catch(next);

};
