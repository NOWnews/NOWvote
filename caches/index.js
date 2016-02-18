
import Promise from 'bluebird';
import redis from 'redis';

/*
 * 利用 bluebird 將 redis 轉換成可以使用 promise 
 */
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
const client = redis.createClient();

client.set('foo', 'bar');
client.expire('foo', 10);

module.exports = client;