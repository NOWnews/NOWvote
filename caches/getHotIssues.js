
/*
 * 從 redis 找熱門 issues 清單
 */

import co from 'co';
import Promise from 'bluebird';
import is from 'is_js';

const debug = require('debug')('NOWvote:caches:getHotIssues');
const models = require('../models');
const getRedisValue = require('./getRedisValue');
const setRedisValue = require('./setRedisValue');


module.exports = co.wrap(function*() {

    let issues = yield getRedisValue('hotIssues');

    debug('redis issues = %j', issues);
    debug('issues = %j', issues);

    if(is.array(issues) && issues.length !== 0) {
        debug('redis issues data = %j', issues);
        return yield Promise.resolve(issues);
    }

    let now = Date.now();
    let issuesFromModels = yield models.issue.find()
        .where('trashed').equals(false)
        .where('status').equals(true)
        .where('type').equals('VOTE')
        .or([
            { continued: true },
            { startTime: { $lte: now }, endTime: { $gte: now } }
        ])
        .populate('category')
        .sort('-counter')
        .limit(5)
        .execAsync();

    debug('mongodb hotIssues data = %j', issuesFromModels);

    // 過期時間預設 20 分鐘
    let updateRedisHotIssues = yield setRedisValue('hotIssues', issuesFromModels, 1200);

    return yield Promise.resolve(updateRedisHotIssues);
});