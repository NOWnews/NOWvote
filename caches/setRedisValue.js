
import co from 'co';
import Promise from 'bluebird';

const debug = require('debug')('NOWvote:caches:setRedisValue');
const client = require('./client');


/*
 * 利用 key 與 value 將資料存入 redis，並設定過期時間
 */
module.exports = co.wrap(function*(key, value, expire) {

    // 如果沒有帶過期時間，預設 3600 毫秒
    if(!expire) {
        let expire = config.redisExpireSeconds;
    }

    let valueString = JSON.stringify(value);
    client.set(key, valueString);
    client.expire(key, expire);
    let cacheValue = yield client.getAsync(key);
    let valueObject = JSON.parse(cacheValue);
    return yield Promise.resolve(valueObject);
});