
import co from 'co';

const debug = require('debug')('NOWvote:server:controllers:vote:action.vote');
const models = require('../../../models');

module.exports = function(req, res, next) {

    let data = req.body;
    debug('data = %s', data);

    return res.json(data);

};
