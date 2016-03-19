
import co from 'co';
import moment from 'moment-timezone';

const debug = require('debug')('NOWvote:admin:controllers:adminUser:page.update');
const models = require('../../../models');

module.exports = function(req, res, next) {

    let sn = req.params.sn;

    co(function*() {

        let adminUser = yield models.adminUser.findBySn(sn, ['createdBy', 'updatedBy'], true);

        // 因為 mongodb 存的時間太醜了，所以抓出來衝新整理
        adminUser.formatCreatedAt = moment(adminUser.createdAt)
            .tz('Asia/Taipei')
            .format('YYYY/MM/DD HH:mm:ss');
        adminUser.formatUpdatedAt = moment(adminUser.updatedAt)
            .tz('Asia/Taipei')
            .format('YYYY/MM/DD HH:mm:ss');
        debug('adminUser = %j', adminUser);

        return res.render('adminUser/update.html', {
            adminUser: adminUser
        });
    })
    .catch(next);
};