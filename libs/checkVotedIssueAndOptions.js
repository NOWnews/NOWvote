
import co from 'co';
import is from 'is_js';
import Promise from 'bluebird';

const models = require('../models');

module.exports = co.wrap(function*(userId, issue) {

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