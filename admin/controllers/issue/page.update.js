
import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:issue:issue:page.update');

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

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let issue = yield models.issue.findOne()
            .where('sn').equals(sn)
            .where('trashed').equals(false)
            .deepPopulate('category tags questions.options')
            .execAsync();

        let categories = yield models.category.find()
            .where('trashed').equals(false)
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

        return res.render('issue/update', {
            issue: issue,
            categories: categories,
            tags: tags
        });
    })
    .catch(next);

};
