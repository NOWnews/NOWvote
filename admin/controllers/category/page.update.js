import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:menu:category:page.update');
const formatUpdateFrontData = function (category) {
    let startTime = moment(category.startTime).tz('Asia/Taipei');
    let endTime = moment(category.endTime).tz('Asia/Taipei');

    category.startAtDay = startTime.format('YYYY-MM-DD');
    category.startAtHour = startTime.format('HH:mm');
    category.endAtDay = endTime.format('YYYY-MM-DD');
    category.endAtHour = endTime.format('HH:mm');
    return category;
};

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let category = yield models.category.findOne()
            .where('sn').equals(sn)
            .lean()
            .execAsync();

        // 如果常駐被勾起來，就不需要記錄時間
        if(!category.continued) {
            formatUpdateFrontData(category);
        }

        return res.render('category/update', {item: category});
    })
    .catch(next);

};
