import co from 'co';
import models from '../../../models';
import moment from 'moment-timezone';

const debug = require('debug')('NOWvote:admin:controllers:issue:page.list');
const formatUpdateIssuesData = function (issues) {
    let newTime = moment().tz('Asia/Taipei').valueOf();
    debug('newTime = %j', moment().valueOf());
    issues = _.map(issues, function (issue){
        if (issue.continued){
            issue.schedule = true;
            return issue;
        }

        let startTime = moment(issue.startTime).valueOf();
        let endTime = moment(issue.endTime).valueOf();

        if (newTime > startTime && newTime < endTime) {
            issue.schedule = true;
        } else {
            issue.schedule = false;
        }
        issue.startTime = moment(issue.startTime).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm');
        return issue;
    });

    return issues;
};

module.exports = function(req, res, next) {

    co(function*() {

        let issues = yield models.issue.find()
            .populate('category')
            .where('trashed').equals(false)
            .deepPopulate('questions.options')
            .lean()
            .execAsync();

        issues = formatUpdateIssuesData(issues);

        debug('issues = %j', issues);

        return res.render('issue/list', {issues: issues});
    })
    .catch(next);

};
