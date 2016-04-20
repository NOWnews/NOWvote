
import co from 'co';
import is from 'is_js';
import fetch from 'node-fetch';

const debug = require('debug')('NOWvote:caches:getInstantNews');
const client = require('./client');
const getRedisValue = require('./getRedisValue');
const setRedisValue = require('./setRedisValue');

/*
 * 撈取即時新聞
 */
module.exports = co.wrap(function*() {

    let newsInstant = yield getRedisValue('newsInstant');
    debug('newsInstant = %j', newsInstant);

    if(is.array(newsInstant) && newsInstant.length !== 0) {
        debug('redis newsInstant data = %j', newsInstant);
        return yield Promise.resolve(newsInstant);
    }

    let newsInstantFromApi = yield fetch('http://v2.api.nownews.com/instant', {
            timeout: 2000
        })
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            return Promise.resolve(json);
        });
    debug('News Instant From Api = %j', newsInstantFromApi);

    let updateRedisInstantNews = yield setRedisValue('newsInstant', newsInstantFromApi, 300);

    return yield Promise.resolve(updateRedisInstantNews);
});