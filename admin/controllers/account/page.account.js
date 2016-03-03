
const debug = require('debug')('NOWvote:admin:controllers:account');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    co(function*() {
        let issues = yield models.issue.find().execAsync();
        debug('issues = %j', issues);
        return res.render('account');
    })
    .catch(next);

};
