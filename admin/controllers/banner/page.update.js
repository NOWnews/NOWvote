
import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:banner:page.update');
const formatUpdateFrontData = function (banner) {
    let startTime = moment(banner.startTime).tz('Asia/Taipei');
    let endTime = moment(banner.endTime).tz('Asia/Taipei');

    banner.startAtDay = startTime.format('YYYY-MM-DD');
    banner.startAtHour = startTime.format('HH:mm');
    banner.endAtDay = endTime.format('YYYY-MM-DD');
    banner.endAtHour = endTime.format('HH:mm');
    return banner;
};

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let banner = yield models.banner.findOne()
            .where('sn').equals(sn)
            .lean()
            .execAsync();

        // 如果常駐被勾起來，就不需要記錄時間
        if(!banner.continued) {
            formatUpdateFrontData(banner);
        }

        return res.render('banner/update', {item: banner});
    })
    .catch(next);

};
