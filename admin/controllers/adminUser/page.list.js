
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:adminUser:page.list');
const models = require('../../../models');

module.exports = async function(req, res, next) {

    let adminUsers = await models.adminUser.find().execAsync();
    debug('adminUsers = %j', adminUsers);

    return res.render('adminUser/list', { adminUsers: adminUsers });
};