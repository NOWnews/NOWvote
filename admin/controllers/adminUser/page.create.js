
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:adminUser:page.create');
const models = require('../../../models');

module.exports = function(req, res, next) {
    return res.render('adminUser/create');
};