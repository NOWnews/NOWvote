
import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:issue:sliderBanner:page.update');
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

        let issue = yield models.issue.findOne()
            .where('sn').equals(sn)
            .where('trashed').equals(false)
            .deepPopulate('questions.options')
            .execAsync();

        let categoris = yield models.menuCategory.find()
            .where('trashed').equals(false)
            .execAsync();

        // 如果常駐被勾起來，就不需要記錄時間
        if(!issue.continued) {
            formatUpdateFrontData(issue);
        }

        // return res.json({issue: issue});
        return res.render('issue/update', {
            issue: issue,
            categoris: categoris
        });
    })
    .catch(next);

};
