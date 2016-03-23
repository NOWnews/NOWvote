import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:menu:menuCategory:page.update');
const formatUpdateFrontData = function (menuCategory) {
    let startTime = moment(menuCategory.startTime).tz('Asia/Taipei');
    let endTime = moment(menuCategory.endTime).tz('Asia/Taipei');

    menuCategory.startAtDay = startTime.format('YYYY-MM-DD');
    menuCategory.startAtHour = startTime.format('HH:mm');
    menuCategory.endAtDay = endTime.format('YYYY-MM-DD');
    menuCategory.endAtHour = endTime.format('HH:mm');
    return menuCategory;
};

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let menuCategory = yield models.menuCategory.findOne()
            .where('sn').equals(sn)
            .lean()
            .execAsync();

        // 如果常駐被勾起來，就不需要記錄時間
        if(!menuCategory.continued) {
            formatUpdateFrontData(menuCategory);
        }

        return res.render('menuCategory/update', {item: menuCategory});
    })
    .catch(next);

};
