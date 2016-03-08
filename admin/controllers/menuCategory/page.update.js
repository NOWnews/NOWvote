
const debug = require('debug')('NOWvote:admin:controllers:menu:menuCategory:page.update');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let menuCategory = models.menuCategory.findOne()
            .where('sn').equals(sn)
            .where('trashed').equals(false)
            .execAsync();

        return res.render('menuCategory/create', {item: menuCategory});
    })
    .catch(next);

};
