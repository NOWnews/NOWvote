
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:user:page.show');
const models = require('../../../models');
const libs = require('../../../libs');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let user = yield models.user.findBySn(sn);
        debug('user = %j', user);

        return res.render('user/show', {
            user: user
        });
    })
    .catch(next);
}; 