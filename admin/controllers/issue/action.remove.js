import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:issue:action.remove');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);

    co(function*() {

        let issue = yield models.issue.findOne()
            .where('sn').equals(sn)
            .execAsync();

        issue.set('trashed', true);
        let removedIssue = yield issue
            .saveAsync();

        debug('removedIssue = %j', removedIssue);

        // 更新首頁 redis issue 與 hotIssues
        yield [
            redis.updateRedisByKey('indexIssues'),
            redis.updateRedisByKey('hotIssues')
        ];

        return res.json(removedIssue);
    })
    .catch(next);

};
