
import randtoken from 'rand-token';
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:issue:action.preview');

const redis = require('../../../caches');

module.exports = function(req, res, next) {

    let data = req.body;
    let token = randtoken.generate(30);

    co(function*() {

        debug('token = %s', token);

        debug('data = %j', req.body);

        data.token = token;

        let tmpPreview = yield redis.setRedisValue(token, data, 10);
        let serviceUrl = config.webSite.serviceUrl;
        debug('tmpPreview = %j', tmpPreview);

        return res.json({
            token: token,
            serviceUrl: serviceUrl
        });
    })
    .catch(next);
};
