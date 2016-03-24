
import co from 'co';
import Promise from 'bluebird';
import is from 'is_js';

const debug = require('debug')('NOWvote:caches:getBanner');
const models = require('../models');
const getRedisValue = require('./getRedisValue');
const setRedisValue = require('./setRedisValue');

/*
 * 從 redis 要 banner 清單
 * 去 redis 找所有分類清單，沒有的話會去 mongodb 要，並存回 redis
 */
module.exports = co.wrap(function*(key) {
    let banner = yield getRedisValue('banner') || [];

    debug('redis banner = %j', banner);
    debug('banner=%j', banner);

    if(is.array(banner) && banner.length !== 0) {
        debug('redis banner data = %j', banner);
        return yield Promise.resolve(banner);
    }

    let bannerFromModels = yield models.banner.findEffective();
    debug('mongodb banner data = %j', bannerFromModels);

    let updateRedisBanner = yield setRedisValue('banner', bannerFromModels, config.redisExpireSeconds);

    return yield Promise.resolve(updateRedisBanner);
});
