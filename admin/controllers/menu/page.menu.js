
const debug = require('debug')('NOWvote:admin:controllers:menu');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    co(function*() {
        let issues = yield models.issue.find().execAsync();
        debug('issues = %j', issues);
        console.log("是試試", issues);
        return res.render('menu');
    })
    .catch(next);

};
