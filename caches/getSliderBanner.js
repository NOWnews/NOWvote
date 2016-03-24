
import co from 'co';
import Promise from 'bluebird';
import is from 'is_js';

const debug = require('debug')('NOWvote:caches:getBanner');
const models = require('../models');
const getRedisValue = require('./getRedisValue');
const setRedisValue = require('./setRedisValue');

/*
 * 從 redis 要 sliderBanner 清單
 * 去 redis 找所有分類清單，沒有的話會去 mongodb 要，並存回 redis
 */
module.exports = co.wrap(function*(key) {
    let sliderBanner = yield getRedisValue('sliderBanner') || [];

    debug('redis sliderBanner = %j', sliderBanner);
    debug('sliderBanner=%j', sliderBanner);

    if(is.array(sliderBanner) && sliderBanner.length !== 0) {
        debug('redis sliderBanner data = %j', sliderBanner);
        return yield Promise.resolve(sliderBanner);
    }

    let sliderBannerFromModels = yield models.sliderBanner.findEffective();
    debug('mongodb sliderBanner data = %j', sliderBannerFromModels);

    let updateRedisSliderBanner = yield setRedisValue('sliderBanner', sliderBannerFromModels, config.redisExpireSeconds);

    return yield Promise.resolve(updateRedisSliderBanner);
});
