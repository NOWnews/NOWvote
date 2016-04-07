
const debug = require('debug')('NOWvote:server:controllers:home:page.index');

import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

module.exports = function(req, res, next) {

    co(function*() {

        // 非同步去取得資料
        let results = yield [
            // 從 redis 取得 category 的資料
            redis.getCategory(),

            // 從 redis 取得 slideBanner 的資料
            redis.getBanner(),

            // 從 redis 取得首頁 issue 的資料
            redis.getIndexIssues(true),

            // 取得即時新聞資料
            redis.getInstantNews()
        ];
        debug('results = %j', results);


        let categories = results[0];
        let banners = results[1];
        let issues = results[2];
        let hotNews = results[3];
        debug('categories = %j', categories);
        debug('banners = %j', banners);
        debug('issues = %j', issues);
        debug('hotNews = %j', hotNews);

        /*
         * TODO: 判斷使用者是否投過票了
         */

        return res.render('home/home', {
            issues: issues,
            categories: categories,
            banners: banners,
            hotnews: hotNews
        });
    })
    .catch(next);

};
