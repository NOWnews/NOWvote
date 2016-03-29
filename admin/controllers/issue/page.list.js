import co from 'co';
import models from '../../../models';
import moment from 'moment-timezone';

const debug = require('debug')('NOWvote:admin:controllers:issue:page.list');

const formatUpdateIssuesData = function (issues) {

    let now = moment().tz('Asia/Taipei').valueOf();

    debug('now = %j', moment().valueOf());

    issues = _.map(issues, function (issue){

        issue.schedule = false;
        if (issue.continued){
            issue.schedule = true;
            return issue;
        }

        let startTime = moment(issue.startTime).valueOf();
        let endTime = moment(issue.endTime).valueOf();

        if ( now > startTime && now < endTime ) {
            issue.schedule = true;
        }

        issue.startTime = moment(issue.startTime).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm');
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

        issues = formatUpdateIssuesData(issues);

        debug('issues = %j', issues);

        return res.render('issue/list', {issues: issues});
    })
    .catch(next);

};
