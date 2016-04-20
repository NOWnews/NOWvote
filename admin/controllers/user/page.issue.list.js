
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:user:page.issue.list');
const models = require('../../../models');
const libs = require('../../../libs');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    let currentPage = req.query.page || 1;
    let limit = 30;
    let skip = ( currentPage - 1 ) * limit;

    co(function*() {

        let user = yield models.user.findBySn(sn);
        debug('user = %j', user);

        if(!user) {

        }

        let results = yield [
            models.issueRelation.find()
                .where('user').equals(user._id)
                // .where('user').equals('500000000000000000000012')
                .execAsync(),

            models.issueRelation.find()
                .where('user').equals(user._id)
                // .where('user').equals('500000000000000000000012')
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
            .where('type').equals('ISSUE')
            .execAsync();
        debug('issues = %j', issues);

        // 處理 pagination
        let pageInfo = libs.pagination({
            total: totalIssues,
            currnetPage: currentPage,
            limit: limit
        });
        debug('pageInfo = %j', pageInfo);


        return res.render('user/issues', {
            user: user,
            issues: issues,
            pageInfo: pageInfo
        });
    })
    .catch(next);
}; 