import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:server:controllers:user:action.update');

module.exports = function(req, res, next) {
    let sn = parseInt(req.session.user.sn, 10);
    let data = req.body;

    co(function*() {
        let fields = [
            'email',
            'phone',
            'address',
            'info',
            'gender',
            'birthday'
        ];
        let user = yield models.user.findOne()
            .where('sn').equals(sn)
            .execAsync();

        _.forEach(fields, function(value){
            user.set(value, data[value]);
        });
        user.set('updatedAt', Date.now());

        yield user.saveAsync();

        return res.json(user);
    })
    .catch(next);
};
