
const debug = require('debug')('NOWvote:server:controllers:home');

import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

module.exports = function(req, res, next) {

    co(function*() {

        // 非同步去取得資料
        let results = yield [
            // 從 redis 取得 menuCategory 的資料
            yield redis.getmenuCategory(),

            // 從 redis 取得 slideBanner 的資料
            yield redis.getSliderBanner(),

            // 取得首頁 issue 的資料
            yield models.issue.find().execAsync()
        ];
        debug('results = %j', results);

        let menuCategory = results[0];
        let sliderSliderBanner = results[1];
        let issues = results[2];
        debug('menuCategory = %j', menuCategory);
        debug('sliderSliderBanner = %j', sliderSliderBanner);
        debug('issues = %j', issues);

        return res.render('homepage', {
            issues: issues,
            menuCategory: menuCategory,
            sliderSliderBanner: sliderSliderBanner
        });
    })
    .catch(next);

};
