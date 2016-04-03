
const debug = require('debug')('NOWvote:server:controllers:issue:page.show');

import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

const libs = require('../../../libs');

module.exports = function(req, res, next) {

    co(function*() {

       // 非同步去取得資料
        let results = yield [
            // 從 redis 取得 Category 的資料
            redis.getCategory(),
            redis.getBanner(),

            // 取得新聞
            redis.getHotNews(),
            redis.get36News(),

            // 取得 issue
            models.issue.findBySn(req.params.sn)
        ];

        let categories = results[0];
        debug('category = %j', categories);

        let banners = results[1];
        debug('banner = %j', banners);

        let hotNews = results[2];
        debug('hotNews = %j', hotNews);

        let news36 = results[3];
        debug('news36 = %j', news36);

        let issue = results[4];
        debug('issue = %j', issue);

        issue.startTime = libs.formatDate(issue.startTime);
        issue.endTime = libs.formatDate(issue.endTime);

        return res.render('issue/issue', {
          categories: categories,
          issue: issue,
          hotNews: hotNews,
          news36: news36
        });
    })
    .catch(next);

};
