import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:menu:content:page.update');
const formatUpdateFrontData = function (content) {
    let startTime = moment(content.startTime).tz('Asia/Taipei');
    let endTime = moment(content.endTime).tz('Asia/Taipei');

    content.startAtDay = startTime.format('YYYY-MM-DD');
    content.startAtHour = startTime.format('HH:mm');
    content.endAtDay = endTime.format('YYYY-MM-DD');
    content.endAtHour = endTime.format('HH:mm');
    return content;
};

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let content = yield models.content.findOne()
            .where('sn').equals(sn)
            .lean()
            .execAsync();
        formatUpdateFrontData(content);
        return res.render('content/create', {item: content});
    })
    .catch(next);

};
