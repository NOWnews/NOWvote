import co from 'co';

const debug = require('debug')('NOWvote:server:controllers:user:page.myIssues');
const models = require('../../../models');
const redis = require('../../../caches');
const libs = require('../../../libs');

module.exports = function(req, res, next) {
    let userId = req.session.user._id;
    let currentPage = req.query.page || 1;
    let limit = 30;
    let skip = ( currentPage - 1 ) * limit;

    co(function*() {

        let categories = yield redis.getCategory();
        let results = yield [
            models.issueRelation.find()
                .where('user').equals(userId)
                .execAsync(),

            models.issueRelation.find()
                .where('user').equals(userId)
                .count()
                .execAsync()
        ];

        let issueRelations = results[0];
        let totalIssues = results[1];

        let issueIds = _.map(issueRelations, function(issueRelation) {
            return issueRelation.issue;
        });
        debug('issueIds = %j', issueIds);

        let issues = yield models.issue.find()
            .where('_id').in(issueIds)
            .where('type').equals('VOTE')
            .execAsync();
        debug('issues = %j', issues);

        // 處理 pagination
        let pageInfo = libs.pagination({
            total: totalIssues,
            currnetPage: currentPage,
            limit: limit
        });
        debug('pageInfo = %j', pageInfo);
        // return res.json({
        //     issues: issues,
        //     pageInfo: pageInfo
        // });
        return res.render('user/meIssues', {
            issues: issues,
            pageInfo: pageInfo,
            categories: categories
        });
    })
    .catch(next);
};
