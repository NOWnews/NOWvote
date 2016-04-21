
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
const client = redis.createClient({
    host: config.redis.host
});

module.exports = client;
