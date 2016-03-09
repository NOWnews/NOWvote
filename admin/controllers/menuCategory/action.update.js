import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:menu:menuCategory:action.update');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    let data = req.body;

    co(function*() {

        let status = data.status ? true : false;
        let startTime = moment( `${data.startAtDay} ${data.startAtHour}` );
        let endTime = moment( `${data.endAtDay} ${data.endAtHour}` );

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
