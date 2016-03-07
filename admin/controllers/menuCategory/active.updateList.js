
const debug = require('debug')('NOWvote:admin:controllers:menu');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    co(function*() {
        let data = req.body;
        let weightList = req.body.weightList.split(',');
        let statusList = req.body['status[]'];
        let menuCategorys = yield models.menuCategory.update({ trashed: false }).execAsync();
        menuCategorys = menuCategorys.map(function( menuCategory, index ){
            menuCategory.weight = weightList.indexOf(menuCategory.sn);
            if(menuCategory.sn in statusList){
                menuCategory.status = true;
            } else {
                menuCategory.status = false;
            }
            return menuCategory;
        })
        menuCategorys.save();
        return res.redirect('/menuCategory');
    })
    .catch(next);

};
