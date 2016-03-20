
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:adminUser:action.remove');
const models = require('../../../models');

module.exports = function(req, res, next) {

    let sn = req.params.sn;

    co(function*() {

        let adminUser = yield models.adminUser.findBySn(sn);

        debug('adminUser = %j', adminUser);

        adminUser.set('trashed', true);
        let removedAdminUser = yield adminUser.saveAsync();
        debug('removedAdminUser = %j', removedAdminUser);

        return res.json(removedAdminUser);
    })
    .catch(next);
};