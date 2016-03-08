import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:menu:menuCategory:page.update');
const formatUpdateFrontData = function (menuCategory) {
    menuCategory['start-day'] = moment(menuCategory.startTime).tz('Asia/Taipei').format('YYYY-MM-DD');
    menuCategory['start-hour'] = moment(menuCategory.startTime).tz('Asia/Taipei').format('HH:mm');
    menuCategory['end-day'] = moment(menuCategory.endTime).tz('Asia/Taipei').format('YYYY-MM-DD');
    menuCategory['end-hour'] = moment(menuCategory.endTime).tz('Asia/Taipei').format('HH:mm');
    return menuCategory;
};

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let menuCategory = yield models.menuCategory.findOne()
            .where('sn').equals(sn)
            .lean()
            .execAsync();
        formatUpdateFrontData(menuCategory);
        return res.render('menuCategory/create', {item: menuCategory});
    })
    .catch(next);

};
