
const debug = require('debug')('NOWvote:server:controllers:issue:page.show');

import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

module.exports = function(req, res, next) {

    co(function*() {

       // 非同步去取得資料
        let results = yield [
            // 從 redis 取得 menuCategory 的資料
            yield redis.getCategory(),

            yield redis.getBanner(),
            yield models.issue.findBySn(req.params.sn)

        ];
        // debug('results = %j', results);

        let categories = results[0];
        debug('category = %j', categories);

        let banners = results[1];
        debug('banner = %j', banners);


        let issue = results[2];
        debug('issue = %j', issue);


        return res.render('issue/issue', {

          // banners: banners,
          categories: categories,
          issue: issue
        });
    })
    .catch(next);

};
