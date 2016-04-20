
import co from 'co';
import is from 'is_js';
import fetch from 'node-fetch';

const debug = require('debug')('NOWvote:caches:get36News');
const client = require('./client');
const getRedisValue = require('./getRedisValue');
const setRedisValue = require('./setRedisValue');

/*
 * 撈取大三小六新聞
 */
module.exports = co.wrap(function*() {

    let news36 = yield getRedisValue('news36');

    debug('news36 = %j', news36);
    if(is.array(news36) && news36.length !== 0) {
        debug('redis news36 data = %j', news36);
        return yield Promise.resolve(news36);
    }

    let news36FromApi = yield fetch('http://v2.api.nownews.com/36', {
            timeout: 2000
        })
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            return Promise.resolve(json);
        });
    debug('News36 From Api = %j', news36FromApi);

    let updateRedisNews36 = yield setRedisValue('news36', news36FromApi, 300);

    return yield Promise.resolve(updateRedisNews36);
});