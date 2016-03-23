import co from 'co';
import Promise from 'bluebird';
import _ from 'lodash';
import models from '../../../models';
import redis from '../../../caches';

const debug = require('debug')('NOWvote:admin:controllers:issue:action.updateList');

module.exports = function(req, res, next) {

    let data = req.body;

    co(function*() {
        let statusList = _.isArray(data['status[]']) ? data['status[]'] : [data['status[]']];

        let issues = yield models.issue.find()
            .where('trashed').equals(false)
            .execAsync();

        let updatedIssueList = yield Promise.map(issues, function(menuItem) {

            if(_.indexOf(statusList, String(menuItem.sn)) !== -1){
                menuItem.set('status', true);
                return menuItem.saveAsync();
            }else{
                menuItem.set('status', false);
                return menuItem.saveAsync();
            }
        });

        debug('updatedIssueList = %j', updatedIssueList);

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('indexIssues');

        return res.redirect('/issue');
    })
    .catch(next);

};
