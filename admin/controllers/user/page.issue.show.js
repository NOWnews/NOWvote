
import co from 'co';
import is from 'is_js';
import Promise from 'bluebird';
import moment from 'moment-timezone';

const debug = require('debug')('NOWvote:admin:controllers:user:page.issue.show');

const models = require('../../../models');
const libs = require('../../../libs');

const formatUpdateFrontData = function (issue) {
    let startTime = moment(issue.startTime).tz('Asia/Taipei');
    let endTime = moment(issue.endTime).tz('Asia/Taipei');

    issue.startAtDay = startTime.format('YYYY-MM-DD');
    issue.startAtHour = startTime.format('HH:mm');
    issue.endAtDay = endTime.format('YYYY-MM-DD');
    issue.endAtHour = endTime.format('HH:mm');
    return issue;
};

const checkVotedIssueAndOptions = co.wrap(function*(userId, issue) {

    let issueObject;

    if(is.number(issue)) {
        issueObject = yield models.issue.findBySn(issue);
    }

    if(is.string(issue)) {
        issueObject = yield models.issue.findById(issue);
    }

    if(is.object(issue)) {
        issueObject = issue;
    }

    let votedIssues = yield models.issueRelation.find()
        .where('user').equals(userId)
        .where('issue').equals(issueObject._id)
        .execAsync();

    if(votedIssues.length > 0){
        issueObject.isVoted = true;
    }

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

    return yield Promise.resolve(issueObject);
});

module.exports = function(req, res, next) {

    let issueSn = parseInt(req.params.issueSn, 10);
    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let user = yield models.user.findBySn(sn);

        let issue = yield models.issue.findOne()
            .where('sn').equals(issueSn)
            .deepPopulate('category tags questions.options')
            .lean()
            .execAsync();

        issue = yield checkVotedIssueAndOptions(user._id, issue);
        // issue = yield libs.checkVotedIssueAndOptions('500000000000000000000012', issue);

        debug('issue = %j', issue);

        // 如果常駐被勾起來，就不需要記錄時間
        if(!issue.continued) {
            formatUpdateFrontData(issue);
        }

        // 這邊在處理 tag，為了給該死的前端用
        let tags = [];
        if(issue.tags.length > 0) {
            tags = issue.tags.join(', ');
        }
        debug('tags = %j', tags);

        return res.render('user/issue', {
            issue: issue,
            tags: tags
        });
    })
    .catch(next);
};
