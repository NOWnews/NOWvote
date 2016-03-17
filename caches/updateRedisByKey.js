
import co from 'co';
import Promise from 'bluebird';

const debug = require('debug')('NOWvote:caches:updateRedisByKey');
const models = require('../models');
const setRedisValue = require('./setRedisValue');


/*
 * 更新 Redis 裡面的資料
 */
module.exports = co.wrap(function*(key) {

    const validateArray = ['sliderBanner', 'menuCategory'];

    if(!key || _.indexOf(validateArray, key) === -1) {
        return yield Promise.reject(new Error('update redis data need key'));
    }

    if(key === 'sliderBanner') {
        let sliderBanner = yield models.sliderBanner.findEffective();
        debug('sliderBanner = %j', sliderBanner);
        return yield setRedisValue('sliderBanner', sliderBanner, config.redisExpireSeconds);
    }

    if(key === 'menuCategory') {
        let menu = yield models.menuCategory.findEffective();
        debug('menu = %j', menu);
        return yield setRedisValue('menuCategory', menu, config.redisExpireSeconds);
    }
});