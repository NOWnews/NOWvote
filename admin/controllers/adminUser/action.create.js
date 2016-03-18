
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:adminUser:action.create');
const models = require('../../../models');
const libs = require('../../../libs');

module.exports = function(req, res, next) {

    let data = req.body;
    debug('req.body = %j', data);

    co(function*() {

        let newAdminUser = yield models.adminUser.createAsync({
            name: data.name,
            email: data.email,
            password: libs.hashPwd(data.password),
            policy: data.policy || undefined,
            createdBy: data.createdBy
        });
        debug('newAdminUser = %j', newAdminUser);

        return res.redirect('/adminUser/');
    })
    .catch(next);
};