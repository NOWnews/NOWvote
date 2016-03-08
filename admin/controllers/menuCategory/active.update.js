
const debug = require('debug')('NOWvote:admin:controllers:menu:menuCategory:active.update');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    let data = req.body;

    co(function*() {

        let status = data.status ? true : false;
        let startTime = new Date( data['start-day'] + ' ' + data['start-hour'] );
        let endTime = new Date( data['end-day'] + ' ' + data['end-hour'] );

        let menuCategory = yield models.menuCategory.findOne()
            .where('sn').equals(sn)
            .execAsync();

        menuCategory.set('title', data.title);
        menuCategory.set('url', data.url);
        menuCategory.set('desc', data.desc);
        menuCategory.set('startTime', startTime);
        menuCategory.set('endTime', endTime);
        menuCategory.set('status', status);

        yield menuCategory.saveAsync();

        return res.redirect('/menuCategory');
    })
    .catch(next);

};
