
import co from 'co';

const redis = require('../../../caches');
const models = require('../../../models');
const libs = require('../../../libs');

const debug = require('debug')('NOWvote:server:controllers:category:page.list');

module.exports = function(req, res, next) {

    let categoryName = req.params.category;
    let currentPage = req.query.page || 1;
    let limit = 12;
    let skip = ( currentPage - 1 ) * limit;

    let userId;
    if(req.session && req.session.user){
        userId = req.session.user._id;
    }

    debug('categoryName = %s', categoryName);
    debug('limit = %s', limit);
    debug('skip = %s', skip);

    co(function*() {

        let now = Date.now();

        let categories = yield redis.getCategory();
        let category = yield models.category.findOne()
            .where('title').equals(categoryName)
            .where('trashed').equals(false)
            .where('status').equals(true)
            .or([
                { continued: true },
                { startTime: { $lte: now }, endTime: { $gte: now } }
            ])
            .execAsync();
        debug('category = %j', category);

        if(!category) {
            let err = libs.errorWrapper(10404, '找不到頁面', 'page', new Error());
            return Promise.reject(err);
        }

        let categoryId = category._id;
        debug('categoryId = %s', categoryId);

        let isseusQuery = models.issue.find()
            .where('category').equals(categoryId)
            .where('trashed').equals(false)
            .where('status').equals(true)
            .or([
                { continued: true },
                { startTime: { $lte: now }, endTime: { $gte: now } }
            ])
            .limit(limit)
            .skip(skip)
            .sort('-createdAt')
            .lean();

        let countQuery = models.issue.find()
            .where('category').equals(categoryId)
            .where('trashed').equals(false)
            .where('status').equals(true)
            .or([
                { continued: true },
                { startTime: { $lte: now }, endTime: { $gte: now } }
            ])
            .count();

        // 找尋所有 issues 與總數量，還有新聞
        let results = yield [
            isseusQuery.execAsync(),
            countQuery.execAsync(),
            redis.getHeadlineNews(),
        ];

        let issues = results[0];
        let issuesTotal = results[1];
        let newsHeadline = results[2];

        /*
         * 判斷使用者是否投過票了
         */
        let issueIds = _.map(issues, function(issue) {
            return issue._id;
        });

        debug('issueIds = %j', issueIds);

        let votedIssues = yield models.issueRelation.find()
            // .where('user').equals('500000000000000000000012')
            .where('user').equals(userId)
            .where('issue').in(issueIds)
            .execAsync();

        let votedIssueIds = _.map(votedIssues, function(votedIssue) {
            return votedIssue.issue + '';
        });

        debug('votedIssueIds = %j', votedIssueIds);

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

        // 處理 pagination
        let pageInfo = libs.pagination({
            total: issuesTotal,
            currnetPage: currentPage,
            limit: limit
        });
        debug('pageInfo = %j', pageInfo);

        // 抓取當前的 URL
        let urlPath = req.path;
        debug('urlPath = %s', urlPath);
        return res.render('category/list', {
            categories: categories,
            issues: issues,
            pageInfo: pageInfo,
            newsHeadline: newsHeadline,
            urlPath: urlPath,
            categoryName: categoryName
        });
    })
    .catch(next);
};
