import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:server:controllers:user:action.update');

module.exports = function(req, res, next) {
    let sn = parseInt(req.params.sn, 10);
    let data = req.body;

    co(function*() {

        let user = yield models.user.findOne()
            .where('sn').equals(sn)
            .execAsync();

        _.forEach(data, function(value, key){
            user.set(key, value);
        });

        yield user.saveAsync();

        return res.json(user);
    })
    .catch(next);
};
