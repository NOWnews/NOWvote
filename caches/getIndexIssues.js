
import co from 'co';
import Promise from 'bluebird';
import is from 'is_js';

const debug = require('debug')('NOWvote:caches:getIndexIssues');
const models = require('../models');
const getRedisValue = require('./getRedisValue');
const setRedisValue = require('./setRedisValue');


/*
 * 從 redis 要首頁 issue
 * 去 redis 找所有分類清單，沒有的話會去 mongodb 要，並存回 redis
 */
module.exports = co.wrap(function*() {

    let issues = yield getRedisValue('indexIssues');
    debug('issues = %j', issues);

    if(is.array(issues) && issues.length !== 0) {
        debug('redis issues data = %j', issues);
        return yield Promise.resolve(issues);
    }

    let issuesFromModels = yield models.issue.findIndexIssues();
    debug('mongodb issues data = %j', issuesFromModels);

    let updateRedisIssues = yield setRedisValue('indexIssues', issuesFromModels, 300);

    return yield Promise.resolve(updateRedisIssues);
});
