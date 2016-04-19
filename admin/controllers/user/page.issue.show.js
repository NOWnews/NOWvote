
import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:user:page.issue.show');

const formatUpdateFrontData = function (issue) {
    let startTime = moment(issue.startTime).tz('Asia/Taipei');
    let endTime = moment(issue.endTime).tz('Asia/Taipei');

    issue.startAtDay = startTime.format('YYYY-MM-DD');
    issue.startAtHour = startTime.format('HH:mm');
    issue.endAtDay = endTime.format('YYYY-MM-DD');
    issue.endAtHour = endTime.format('HH:mm');
    return issue;
};

module.exports = function(req, res, next) {

    let issueSn = parseInt(req.params.issueSn, 10);

    co(function*() {

        let issue = yield models.issue.findOne()
            .where('sn').equals(issueSn)
            .deepPopulate('category tags questions.options')
            .execAsync();

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
