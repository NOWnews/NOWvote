
import co from 'co';
import is from 'is_js';
import fetch from 'node-fetch';

const debug = require('debug')('NOWvote:caches:getHotNews');
const client = require('./client');
const getRedisValue = require('./getRedisValue');
const setRedisValue = require('./setRedisValue');

/*
 * 撈取熱門新聞
 */
module.exports = co.wrap(function*() {

    let hotNews = yield getRedisValue('hotNews');

    debug('hotNews = %j', hotNews);
    if(is.array(hotNews) && hotNews.length !== 0) {
        debug('redis hotNews data = %j', hotNews);
        return Promise.resolve(hotNews);
    }

    let hotNewsFromApi = yield fetch('http://v3.api.nownews.com/news/hotNews', {
            timeout: 3000,
            headers: {
                'X-NOWnews-API': 'NOWnewsTaiwanNumberOne'
            }
        })
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            return Promise.resolve(json);
        });
    debug('HotNews From Api = %j', hotNewsFromApi);

    let updateRedisHotNews = yield setRedisValue('hotNews', hotNewsFromApi, 300);

    return Promise.resolve(updateRedisHotNews);
});