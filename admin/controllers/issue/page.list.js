import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:issue:page.list');
const libs = require('../../../libs');

const formatIssuesDate = function (issues) {

    issues = _.map(issues, function (issue){

        if (issue.continued){
            issue.isSchedule = true;
            return issue;
        }

        issue.isSchedule = libs.isSchedule(issue.startTime, issue.endTime);
        issue.endTime = libs.formatDate(issue.endTime);

        return issue;
    });

    return issues;
};

module.exports = function(req, res, next) {

    let currentPage = req.query.page || 1;
    let limit = 12;
    let skip = ( currentPage - 1 ) * limit;

    co(function*() {

        let issues = yield models.issue.find()
            .where('trashed').equals(false)
            .deepPopulate('category questions.options')
            .lean()
            .limit(limit)
            .skip(skip)
            .sort('-createdAt')
            .execAsync();

        issues = formatIssuesDate(issues);
        debug('issues = %j', issues);

        let countQuery = yield models.issue.find()
            .where('trashed').equals(false)
            .count()
            .execAsync();
        debug('countQuery = %j', countQuery);

        // 處理 pagination
        let pageInfo = libs.pagination({
            total: countQuery,
            currnetPage: currentPage,
            limit: limit
        });
        debug('pageInfo = %j', pageInfo);

        return res.render('issue/list', {
            issues: issues,
            pageInfo: pageInfo
        });
    })
    .catch(next);

};
