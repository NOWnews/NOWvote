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

        // TODO 目前不知道為什麼前端 name 丟 status[], 後端接到 name 變成 status, 暫時這樣處理
        if(data.status){
            statusList = _.isArray(data.status) ? data.status : [data.status];
        }

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

        // 更新首頁 redis issue 與 hotIssues
        yield [
            redis.updateRedisByKey('indexIssues'),
            redis.updateRedisByKey('hotIssues')
        ];

        return res.redirect('/issue');
    })
    .catch(next);

};
