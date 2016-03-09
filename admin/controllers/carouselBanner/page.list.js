
const debug = require('debug')('NOWvote:admin:controllers:carouselBanner:page.list');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    co(function*() {
        let issues = yield models.issue.find().execAsync();
        debug('issues = %j', issues);
        return res.render('carousel');
    })
    .catch(next);

};
