
import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:server:controllers:user:page.show');
const redis = require('../../../caches');

module.exports = function(req, res, next) {
    let sn = parseInt(req.session.user.sn, 10);

    co(function*() {

        let results = yield [
            models.user.findBySn(sn),
            redis.getCategory()
        ];

        let user = results[0];
        let categories = results[1];

        debug('user = %j', user);

        return res.render('user/show', {
            user: user,
            categories: categories
        });
    })
    .catch(next);
};
