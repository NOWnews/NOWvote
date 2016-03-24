
const debug = require('debug')('NOWvote:server:controllers:page.index');

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

            // 從 redis 取得首頁 issue 的資料
            yield redis.getIndexIssues(true)
        ];
        debug('results = %j', results);

        let category = results[0];
        let banner = results[1];
        let issues = results[2];
        debug('category = %j', category);
        debug('banner = %j', banner);
        debug('issues = %j', issues);

        /*
         * 處理投票人數問題
         */

        // 找出所有 issue Id
        let issueIds = _.map(issues, function(issue) {
            return issue._id;
        });

        // 找出這些 issue 投票的票數
        let voteCounters = yield models.voteCounter.find()
            .where('issue').in(issueIds)
            .execAsync();
        let voteCountersObj = _.keyBy(voteCounters, 'issue');

        // 把每個 issue 加入 counter 欄位，並且將投票人數帶進去
        _.forEach(issues, function(issue) {
            issue.counter = voteCountersObj[issue._id].counter;
        });


        /*
         * TODO: 判斷使用者是否投過票了
         */

        return res.render('home', {
            issues: issues,
            category: category,
            banner: banner
        });
    })
    .catch(next);

};
