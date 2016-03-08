
const debug = require('debug')('NOWvote:admin:controllers:menu:menuCategory:active.update');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    let data = req.body;

    debug('sn = %s', sn);
    debug('data = %s', data);

    co(function*() {

        let status = data.status ? true : false;
        let startTime = new Date( data['start-day'] + ' ' + data['start-hour'] );
        let endTime = new Date( data['end-day'] + ' ' + data['end-hour'] );

        let menuCategory = yield models.menuCategory.findOne()
            .where('sn').equals(sn)
            .execAsync();

        _.map(menuCategory, function (value, key) {
            debug('value = %s', value);
            debug('key = %s', key);
            return value;
        });

        menuCategory.set('trashed', true);
        let updateMenuCategory = yield menuCategory
            .saveAsync();

        debug('removedMenuCategory = %j', removedMenuCategory);

        return res.json(removedMenuCategory);
    })
    .catch(next);

};
