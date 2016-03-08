const debug = require('debug')('NOWvote:admin:controllers:menuCategory:active.create');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    let data = req.body;

    co(function*() {

        let status = data.status ? true : false;
        let startTime = new Date( data['start-day'] + ' ' + data['start-hour'] );
        let endTime = new Date( data['end-day'] + ' ' + data['end-hour'] );
        let newMenuCategory = yield models.menuCategory.createAsync({
            title: data.title,
            desc: data.desc,
            url: data.url,
            startTime: startTime,
            endTime: endTime,
            status: status,
            weight: 0
        });

        return res.redirect('/menuCategory');
    })
    .catch(next);
}
