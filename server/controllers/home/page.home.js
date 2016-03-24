
const debug = require('debug')('NOWvote:server:controllers:home');

import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

module.exports = function(req, res, next) {

    co(function*() {

        // 非同步去取得資料
        let results = yield [
            // 從 redis 取得 category 的資料
            yield redis.getCategory(),

            // 從 redis 取得 slideBanner 的資料
            yield redis.getBanner(),

            // 取得首頁 issue 的資料
            yield models.issue.find().execAsync()
        ];
        debug('results = %j', results);

        let category = results[0];
        let sliderBanner = results[1];
        let issues = results[2];
        debug('category = %j', category);
        debug('sliderBanner = %j', sliderBanner);
        debug('issues = %j', issues);

        return res.render('homepage', {
            issues: issues,
            category: category,
            sliderBanner: sliderBanner
        });
    })
    .catch(next);

};
