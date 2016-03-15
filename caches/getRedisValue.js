
import co from 'co';

const debug = require('debug')('NOWvote:caches:getRedisValue');
const client = require('./client');

/*
 * 利用 key 把 redis 的資料拉出來
 */
module.exports = co.wrap(function*(key) {
    let cacheValue = yield client.getAsync(key);
    let valueObject = JSON.parse(cacheValue);
    return yield Promise.resolve(valueObject);
});