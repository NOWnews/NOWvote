
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

        issue.isVoted = false;
        issue.startTime = libs.formatDate(issue.startTime);
        issue.endTime = libs.formatDate(issue.endTime);

        // TODO: user 要改用 req.session.user
        let votedIssues = yield models.issueRelation.find()
            .where('user').equals('500000000000000000000012')
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

        debug('issue = %j', issue);

        return res.render('issue/issue', {
          categories: categories,
          issue: issue,
          hotNews: hotNews,
          news36: news36
        });
    })
    .catch(next);

};
