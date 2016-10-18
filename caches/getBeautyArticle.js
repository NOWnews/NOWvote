
import co from 'co';
import is from 'is_js';
import fetch from 'node-fetch';

const debug = require('debug')('NOWvote:caches:getBeautyArticle');
const client = require('./client');
const getRedisValue = require('./getRedisValue');
const setRedisValue = require('./setRedisValue');

/*
 * 撈取美人幫文章
 */
module.exports = co.wrap(function*() {

    let beautyArticle = yield getRedisValue('beautyArticle');

    debug('beautyArticle = %j', beautyArticle);
    if(is.array(beautyArticle) && beautyArticle.length !== 0) {
        debug('redis beautyArticle data = %j', beautyArticle);
        return yield Promise.resolve(beautyArticle);
    }

    let beautyArticleFromApi = yield fetch('http://beauty.nownews.com/rest/feedpath', {
            timeout: 6000
        })
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            return Promise.resolve(json);
        });
    debug('beautyArticle From Api = %j', beautyArticleFromApi);

    let updateBeautyArticles = yield setRedisValue('beautyArticle', beautyArticleFromApi, 300);

    return yield Promise.resolve(updateBeautyArticles);
});
