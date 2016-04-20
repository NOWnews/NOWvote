
const debug = require('debug')('NOWvote:server:controllers:home:page.index');
const libs = require('../../../libs');


import co from 'co';
import models from '../../../models';
import redis from '../../../caches';


module.exports = function(req, res, next) {

    let userId;
    if(req.session && req.session.user){
        userId = req.session.user._id;
    }

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
            redis.getInstantNews(),

            redis.get36News()
        ];
        debug('results = %j', results);

        let categories = results[0];
        let banners = results[1];
        let issues = results[2];
        let hotNews = results[3];
        let news36 = results[4];
        debug('categories = %j', categories);
        debug('banners = %j', banners);
        // debug('issues = %j', issues);
        debug('hotNews = %j', hotNews);

        /*
         * 判斷使用者是否投過票了
         */
        let issueIds = _.map(issues, function(issue) {
            return issue._id;
        });

        let votedIssues = yield models.issueRelation.find()
            // .where('user').equals('500000000000000000000012')
            .where('user').equals(userId)
            .where('issue').in(issueIds)
            .execAsync();

        let votedIssueIds = _.map(votedIssues, function(votedIssue) {
            return votedIssue.issue + '';
        });

        votedIssueIds = _.uniq(votedIssueIds);

        _.forEach(issues, function(issue) {
            issue.startTime = libs.formatDate(issue.startTime);
            issue.endTime = libs.formatDate(issue.endTime);
            if(_.indexOf(votedIssueIds, issue._id + '') >= 0) {
                issue.isVoted = true;
                return;
            }
            issue.isVoted = false;
            return;
        });

        debug('issues = %j', issues);

        return res.render('home/home', {
            issues: issues,
            categories: categories,
            banners: banners,
            hotNews: hotNews,
            news36: news36
        });
    })
    .catch(next);

};
