
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

            // 將美人的圖片加上 imgapi
            let formatImageUrl = _.map(json, function(item) {
                item.featured_image = `http://imgapi.nownews.com/?w=300&q=60&src=${item.featured_image}`;
                return item;
            });

            return Promise.resolve(formatImageUrl);
        });
    debug('beautyArticle From Api = %j', beautyArticleFromApi);

    let updateBeautyArticles = yield setRedisValue('beautyArticle', beautyArticleFromApi, 300);

    return yield Promise.resolve(updateBeautyArticles);
});
