
const debug = require('debug')('NOWvote:server:controllers:issue:page.show');

import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

const libs = require('../../../libs');

module.exports = function(req, res, next) {

    let userId;
    if(req.session && req.session.user) {
        userId = req.session.user._id;
    }

    co(function*() {

       // 非同步去取得資料
        let results = yield [
            // 從 redis 取得 Category 的資料
            redis.getCategory(),
            redis.getBanner(),

            // 取得新聞
            redis.getHotNews(),
            redis.get36News(),

            redis.getHotIssues(),

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

        let hotIssues = results[4];
        debug('hotIssues = %j', hotIssues);

        let issue = results[5];

        issue.isVoted = false;
        issue.startTime = libs.formatDate(issue.startTime);
        issue.endTime = libs.formatDate(issue.endTime);

        let votedIssues = yield models.issueRelation.find()
            .where('user').equals(userId)
            .where('issue').equals(issue._id)
            .execAsync();

        if(votedIssues.length > 0){
            issue.isVoted = true;
        }

        // 做投過哪個選項的判斷
        let votedOptionIds = _.map(votedIssues, function(votedIssue) {
            return votedIssue.option + '';
        });

        _.forEach(issue.questions, function(question){
            _.forEach(question.options, function(option){
                option.isVoted = false;
                if(votedOptionIds.indexOf(option._id + '') >= 0){
                    option.isVoted = true;
                    return;
                }
            });
        });

        /*
         * 取得上一頁跟下一頁的資料
         */
        let now = Date.now();
        let nextAndPrevIssue = yield {
            prev: models.issue.find()
                .where('_id').lt(issue._id)
                .where('trashed').equals(false)
                .where('status').equals(true)
                .or([
                    { continued: true },
                    { startTime: { $lte: now }, endTime: { $gte: now } }
                ])
                .sort('-_id')
                .limit(1)
                .select('title sn'),
            next:  models.issue.find()
                .where('_id').gt(issue._id)
                .where('trashed').equals(false)
                .where('status').equals(true)
                .or([
                    { continued: true },
                    { startTime: { $lte: now }, endTime: { $gte: now } }
                ])
                .sort('_id')
                .select('title sn')
                .limit(1)
        };

        debug('prev issue = %j', nextAndPrevIssue.prev[0]);
        debug('next issue = %j', nextAndPrevIssue.next[0]);
        debug('issue = %j', issue);

        return res.render('issue/issue', {
          categories: categories,
          issue: issue,
          hotNews: hotNews,
          news36: news36,
          hotIssues: hotIssues,
          nextIssue: nextAndPrevIssue.next[0],
          prevIssue: nextAndPrevIssue.prev[0]
        });
    })
    .catch(next);

};
