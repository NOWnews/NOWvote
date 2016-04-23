
import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:server:controllers:user:action.receipt');

module.exports = function(req, res, next) {
    debug('req.body = %j', req.body);
    debug('userId = %j', req.session.user._id);

    co(function*() {

        let userReceipt = yield models.userReceipt.createAsync({
            user: req.session.user._id,
            text: req.body.text
        });

        return res.json({
            text: userReceipt.text
        });
    })
    .catch(next);
};
