
const debug = require('debug')('NOWvote:admin:controllers:menuCategory:action.remove');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let menuCategory = yield models.menuCategory.findOne()
            .where('sn').equals(sn)
            .execAsync();

        menuCategory.set('trashed', true);
        let removedMenuCategory = yield menuCategory
            .saveAsync();

        debug('removedMenuCategory = %j', removedMenuCategory);

        return res.json(removedMenuCategory);
    })
    .catch(next);

};
