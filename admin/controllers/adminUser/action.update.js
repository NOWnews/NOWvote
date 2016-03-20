
import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:adminUser:action.update');

module.exports = function(req, res, next) {

    const updateFields = ['name', 'policy'];
    let data = _.pick(req.body, updateFields);
    let sn = req.params.sn;
    debug('req.body = %j', data);

    co(function*() {

        let adminUser = yield models.adminUser.findBySn(sn);

        updateFields.forEach(function(field) {
            adminUser.set(field, data[field]);
        });

        let updatedAdminUser = yield adminUser.saveAsync();

        return res.redirect(`/adminUser/${sn}`);
    })
    .catch(next);

};