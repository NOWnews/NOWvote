import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:menu:menuCategory:page.update');
const formatUpdateFrontData = function (sliderBanner) {
    let startTime = moment(sliderBanner.startTime).tz('Asia/Taipei');
    let endTime = moment(sliderBanner.endTime).tz('Asia/Taipei');

    sliderBanner.startAtDay = startTime.format('YYYY-MM-DD');
    sliderBanner.startAtHour = startTime.format('HH:mm');
    sliderBanner.endAtDay = endTime.format('YYYY-MM-DD');
    sliderBanner.endAtHour = endTime.format('HH:mm');
    return sliderBanner;
};


module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let sliderBanner = yield models.sliderBanner.findOne()
            .where('sn').equals(sn)
            .lean()
            .execAsync();
        formatUpdateFrontData(sliderBanner);
        return res.render('carouselBanner/update', {item: sliderBanner});
    })
    .catch(next);

};
