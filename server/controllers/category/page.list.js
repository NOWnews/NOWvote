
import co from 'co';

const caches = require('../../../caches');
const models = require('../../../models');
const libs = require('../../../libs');

const debug = require('debug')('NOWvote:server:controllers:category:page.list');

module.exports = function(req, res, next) {

    let categoryName = req.params.category;
    let currentPage = req.query.page || 1;
    let limit = 12;
    let skip = ( currentPage - 1 ) * 12;

    debug('categoryName = %s', categoryName);
    debug('limit = %s', limit);
    debug('skip = %s', skip);

    co(function*() {

        let now = Date.now();

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
            return yield Promise.reject(new Error('此分類無效'));
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

        // 找尋所有 issues 與總數量
        let results = yield [
            isseusQuery.execAsync(),
            countQuery.execAsync(),
        ];

        let issues = results[0];
        let issuesTotal = results[1];
        debug('issues = %j', issues);
        debug('issuesTotal = %d', issuesTotal);

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

        // 處理 pagination
        let pageInfo = libs.pagination({
            total: issuesTotal,
            currnetPage: currentPage,
            limit: limit
        });
        debug('pageInfo = %j', pageInfo);

        return res.json({
            issues: issues,
            pageInfo: pageInfo
        });
    })
    .catch(next);
};
