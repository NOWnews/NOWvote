
const debug = require('debug')('NOWvote:server:controllers:home');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    co(function*() {
        let issues = yield models.issue.find().execAsync();
        debug('issues = %j', issues);
        let data = ['a','b','c','d'];
        // return res.send(200);
        return next(new Error('new Error'));
        return res.render('container', { issues: data });
    })
    .catch(next);

};