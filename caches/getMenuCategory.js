
import co from 'co';
import Promise from 'bluebird';

const debug = require('debug')('NOWvote:caches:getMenuCategory');
const models = require('../models');
const getRedisValue = require('./getRedisValue');
const setRedisValue = require('./setRedisValue');


/*
 * 從 redis 要 menu 清單
 * 去 redis 找所有分類清單，沒有的話會去 mongodb 要，並存回 redis
 */
module.exports = co.wrap(function*(key) {

    let menu = yield getRedisValue('menuCategory') || [];

    if(menu || menu.length !== 0) {
        debug('redis menu data = %j', menu);
        return yield Promise.resolve(menu);
    }

    let menuFromModels = yield models.menuCategort.findEffective();
    debug('mongodb menu data = %j', menuFromModels);

    let updateRedisMenu = yield setRedisValue('menuCategory', menuFromModels, config.redisExpireSeconds);

    return yield Promise.resolve(updateRedisMenu);
});