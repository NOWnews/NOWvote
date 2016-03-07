
const debug = require('debug')('NOWvote:admin:controllers:menu');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    co(function*() {
        console.log('安安安安', req.body);
        return res.json(req.body);
    })
    .catch(next);

};
