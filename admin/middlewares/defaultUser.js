
import co from 'co';
import Debug from 'debug';

const debug = Debug('NOWvote:admin:middlewares:defaultUser');
const models = require('../../models');
const libs = require('../../libs');

const defaultName = 'DEVELOP';
const defaultEmail = 'admin@nownews.com';
const defaultPassword = 'admin@nownews.com';


module.exports = function() {

    co(function*() {

        let adminUser;

        adminUser = yield models.adminUser.findOne()
            .where('email').equals(defaultEmail)
            .where('password').equals(libs.hashPwd(defaultPassword))
            .where('name').equals(defaultName)
            .where('trashed').equals(false)
            .execAsync();

        if(!adminUser){
            adminUser = yield models.adminUser.createAsync({
                _id: '500000000000000000000001',
                email: defaultEmail,
                password: libs.hashPwd(defaultPassword),
                name: defaultName,
                createdBy: '500000000000000000000001'
            });
        }

        debug('init admin user = %j', adminUser);
    })
    .catch(function(err) {
        console.log(err);
    });

    return function(req, res, next) {
        return next();
    };
};