
import co from 'co';
import is from 'is_js';
import fetch from 'node-fetch';

const debug = require('debug')('NOWvote:caches:getHeadlineNews');
const client = require('./client');
const getRedisValue = require('./getRedisValue');
const setRedisValue = require('./setRedisValue');

/*
 * 撈取大三小六新聞
 */
module.exports = co.wrap(function*() {

    let newsHeadline = yield getRedisValue('newsHeadline');

    debug('newsHeadline = %j', newsHeadline);
    if(is.array(newsHeadline) && newsHeadline.length !== 0) {
        debug('redis newsHeadline data = %j', newsHeadline);
        return Promise.resolve(newsHeadline);
    }

    let newsHeadlineFromApi = yield fetch(`http://${config.v3api}/news/headline`, {
            timeout: 6000,
            headers: {
                'X-NOWnews-API': 'NOWnewsTaiwanNumberOne'
            }
        })
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            return Promise.resolve(json);
        });
    debug('NewsHeadline From Api = %j', newsHeadlineFromApi);

    let updateRedisNewsHeadline = yield setRedisValue('newsHeadline', newsHeadlineFromApi, 300);

    return Promise.resolve(updateRedisNewsHeadline);
});