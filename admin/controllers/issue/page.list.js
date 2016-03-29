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
        issue.startTime = libs.formatDate(issue.startTime);

        return issue;
    });

    return issues;
};

module.exports = function(req, res, next) {

    co(function*() {

        let issues = yield models.issue.find()
            .where('trashed').equals(false)
            .deepPopulate('category questions.options')
            .lean()
            .execAsync();

        issues = formatIssuesDate(issues);

        debug('issues = %j', issues);

        return res.render('issue/list', {issues: issues});
    })
    .catch(next);

};
