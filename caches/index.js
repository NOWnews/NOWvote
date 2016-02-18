
import co from 'co';
import Promise from 'bluebird';
import redis from 'redis';


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

module.exports.set = setRedisValue;
module.exports.get = getRedisValue;