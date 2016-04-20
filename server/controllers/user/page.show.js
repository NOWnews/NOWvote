
import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:server:controllers:user:page.show');

module.exports = function(req, res, next) {
    let sn = parseInt(req.session.user.sn, 10);

    co(function*() {

        let user = yield models.user.findBySn(sn);
        debug('user = %j', user);

        return res.render('user/show', {
            user: user
        });
    })
    .catch(next);
};
