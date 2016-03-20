
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:adminUser:page.list');
const models = require('../../../models');

module.exports = function(req, res, next) {

    co(function*() {

        let adminUsers = yield models.adminUser.find()
            .where('trashed').equals(false)
            .execAsync();
        debug('adminUsers = %j', adminUsers);

        return res.render('adminUser/list', { adminUsers: adminUsers });
    })
    .catch(next);
};