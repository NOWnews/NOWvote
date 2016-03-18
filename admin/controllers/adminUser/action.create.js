
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:adminUser:action.create');
const models = require('../../../models');
const libs = require('../../../libs');

module.exports = function(req, res, next) {

    let data = req.body;
    debug('req.body = %j', data);

    if(data.password !== data.confirm) {
        return next(new Error('輸入密碼不一致'));
    }

    co(function*() {

        let newAdminUser = yield models.adminUser.createAsync({
            name: data.name,
            email: data.email,
            password: libs.hashPwd(data.password),
            createdBy: data.createdBy || '500000000000000000000001'
        });
        debug('newAdminUser = %j', newAdminUser);

        return res.redirect('/adminUser/');
    })
    .catch(next);
};