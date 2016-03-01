
import co from 'co';
import Promise from 'bluebird';
import redis from 'redis';
import models from '../models';

const debug = require('debug')('NOWvote:caches:index');


/*
 * 利用 bluebird 將 redis 轉換成可以使用 promise 
 */
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
const client = redis.createClient();


/*
 * 利用 key 把 redis 的資料拉出來
 */
const getRedisValue = co.wrap(function*(key) {
    let cacheValue = yield client.getAsync(key);
    let valueObject = JSON.parse(cacheValue);
    return yield Promise.resolve(valueObject);
});


/*
 * 利用 key 與 value 將資料存入 redis，並設定過期時間
 */
const setRedisValue = co.wrap(function*(key, value, expire) {
    let valueString = JSON.stringify(value);
    client.set(key, valueString);
    client.expire(key, expire);
    let cacheValue = yield client.getAsync(key);
    let valueObject = JSON.parse(cacheValue);
    return yield Promise.resolve(valueObject);
});


/*
 * 從 redis 要 menu 清單
 * 去 redis 找所有分類清單，沒有的話會去 mongodb 要，並存回 redis
 */
const getCategoryMenu = co.wrap(function*() {

    let menu = yield getRedisValue('categoryMenu');

    if(menu !== 0) {
        debug('redis menu data = %j', menu);
        return yield Promise.resolve(menu);
    }

    let now = Date.now();

    let menuFromModels = yield models.category.find()
        .where('trashed').equals(false)
        .where('status').equals(true)
        .where('startTime').lte(now)
        .where('endTime').gte(now)
        .sort('weight')
        .execAsync();
    debug('mongodb menu data = %j', menuFromModels);

    let updateRedisMenu = yield setRedisValue('categoryMenu', menuFromModels, 3600);

    return Promise.resolve(updateRedisMenu);
});


/*
 * 從 redis 要 banner 清單
 * 去 redis 找所有分類清單，沒有的話會去 mongodb 要，並存回 redis
 */
const getBanners = co.wrap(function*() {

    let banners = yield getRedisValue('banners');

    if(banners.length !== 0) {
        debug('redis banners data = %j', banners);
        return yield Promise.resolve(banners);
    }

    let now = Date.now();

    let bannersFromModels = yield models.banner.find()
        .where('trashed').equals(false)
        .where('status').equals(true)
        .where('startTime').lte(now)
        .where('endTime').gte(now)
        .sort('weight')
        .execAsync();
    debug('mongodb banners data = %j', bannersFromModels);

    let updateRedisBanners = yield setRedisValue('banners', bannersFromModels, 3600);

    return Promise.resolve(updateRedisBanners);
});

module.exports.set = setRedisValue;
module.exports.get = getRedisValue;
module.exports.getCategoryMenu = getCategoryMenu;
module.exports.getBanners = getBanners;
