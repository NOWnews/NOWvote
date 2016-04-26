
import co from 'co';
import is from 'is_js';
import fetch from 'node-fetch';

const debug = require('debug')('NOWvote:caches:getBeautyArticle');
const client = require('./client');
const getRedisValue = require('./getRedisValue');
const setRedisValue = require('./setRedisValue');

/*
 * 撈取熱門新聞
 */
module.exports = co.wrap(function*() {

    let beautyArticle = yield getRedisValue('beautyArticle');

    debug('beautyArticle = %j', beautyArticle);
    if(is.array(beautyArticle) && beautyArticle.length !== 0) {
        debug('redis beautyArticle data = %j', beautyArticle);
        return yield Promise.resolve(beautyArticle);
    }

    let beautyArticleFromApi = yield fetch('http://beauty.nownews.com/rest/feedpath', {
            timeout: 3000
        })
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            return Promise.resolve(json);
        });
    debug('HotNews From Api = %j', beautyArticleFromApi);

    let updateRedisHotNews = yield setRedisValue('beautyArticle', beautyArticleFromApi, 300);

    return yield Promise.resolve(updateRedisHotNews);
});
