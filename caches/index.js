
import co from 'co';
import Promise from 'bluebird';
import redis from 'redis';
import models from '../models';

const debug = require('debug')('NOWvote:caches:index');

/*
 * Redis 資料過期時間為 1 小時
 */
const redisExpireSeconds = 3600;


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

    // 如果沒有帶過期時間，預設 3600 毫秒
    if(!expire) {
        let expire = redisExpireSeconds;
    }
    let valueString = JSON.stringify(value);
    client.set(key, valueString);
    client.expire(key, expire);
    let cacheValue = yield client.getAsync(key);
    let valueObject = JSON.parse(cacheValue);
    return yield Promise.resolve(valueObject);
});

/*
 * 重新從 models 取得 menu 的資料
 */
const getMenuFromModels = co.wrap(function*() {
    let now = Date.now();

    return yield models.menuCategory.find()
        .where('trashed').equals(false)
        .where('status').equals(true)
        .where('startTime').lte(now)
        .where('endTime').gte(now)
        .sort('weight')
        .execAsync();
});

/*
 * 重新從 models 取得 sliderBanner 的資料
 */
const getSliderBannerFromModels = co.wrap(function*() {
    let now = Date.now();
    return yield models.sliderBanner.find()
        .where('trashed').equals(false)
        .where('status').equals(true)
        .where('startTime').lte(now)
        .where('endTime').gte(now)
        .sort('weight')
        .execAsync();
});
// sliderBannerFromModels


/*
 * 從 redis 要 menu 清單
 * 去 redis 找所有分類清單，沒有的話會去 mongodb 要，並存回 redis
 */
const getMenuCategory = co.wrap(function*() {

    let menu = yield getRedisValue('menuCategory') || [];

    if(menu || menu.length !== 0) {
        debug('redis menu data = %j', menu);
        return yield Promise.resolve(menu);
    }

    let menuFromModels = yield getMenuFromModels();
    debug('mongodb menu data = %j', menuFromModels);

    let updateRedisMenu = yield setRedisValue('menuCategory', menuFromModels, redisExpireSeconds);

    return Promise.resolve(updateRedisMenu);
});


/*
 * 從 redis 要 sliderBanner 清單
 * 去 redis 找所有分類清單，沒有的話會去 mongodb 要，並存回 redis
 */
const getSliderBanner = co.wrap(function*() {

    let sliderBanner = yield getRedisValue('sliderBanner') || [];

    debug('redis sliderBanner = %j', sliderBanner);

    if(sliderBanner || sliderBanner.length !== 0) {
        debug('redis sliderBanner data = %j', sliderBanner);
        return yield Promise.resolve(sliderBanner);
    }

    let sliderBannerFromModels = yield getSliderBannerFromModels();
    debug('mongodb sliderBanner data = %j', sliderBannerFromModels);

    let updateRedisSliderBanner = yield setRedisValue('sliderBanner', sliderBannerFromModels, redisExpireSeconds);

    return Promise.resolve(updateRedisSliderBanner);
});

const updateRedisByKey = co.wrap(function*(key) {

    const validateArray = ['sliderBanner', 'menuCategory'];

    if(!key || _.indexOf(validateArray, key) === -1) {
        return yield Promise.reject(new Error('update redis data need key'));
    }

    if(key === 'sliderBanner') {
        let sliderBanner = yield getSliderBanner
        FromModels();
        return yield setRedisValue('sliderBanner', sliderBanner, redisExpireSeconds);
    }

    if(key === 'menuCategory') {
        let menu = yield getMenuFromModels();
        return yield setRedisValue('menuCategory', menu, redisExpireSeconds);
    }
});

module.exports.set = setRedisValue;
module.exports.get = getRedisValue;
module.exports.getMenuCategory = getMenuCategory;
module.exports.getSliderBanner = getSliderBanner;
module.exports.updateRedisByKey = updateRedisByKey;
