
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

        let tmpPreview = yield redis.setRedisValue(token, data, 60);
        let foregroundUrl = config.webSite.foregroundUrl;
        debug('tmpPreview = %j', tmpPreview);

        return res.json({
            token: token,
            foregroundUrl: foregroundUrl
        });
    })
    .catch(next);
};
