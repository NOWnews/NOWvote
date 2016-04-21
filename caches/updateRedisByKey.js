
import co from 'co';
import Promise from 'bluebird';

const debug = require('debug')('NOWvote:caches:updateRedisByKey');
const models = require('../models');
const setRedisValue = require('./setRedisValue');


/*
 * 更新 Redis 裡面的資料
 */
module.exports = co.wrap(function*(key) {

    const validateArray = ['banner', 'category', 'indexIssues'];

    if(!key || _.indexOf(validateArray, key) === -1) {
        return yield Promise.reject(new Error('update redis data need current key'));
    }

    if(key === 'banner') {
        let banner = yield models.banner.findEffective();
        debug('banner = %j', banner);
        return yield setRedisValue('banner', banner, config.redis.expireSeconds);
    }

    if(key === 'category') {
        let menu = yield models.category.findEffective();
        debug('menu = %j', menu);
        return yield setRedisValue('category', menu, config.redis.expireSeconds);
    }

    if(key === 'indexIssues') {
        let issues = yield models.issue.findIndexIssues();
        debug('issues = %j', issues);
        // 首頁 issue 過期時間為 5 分鐘
        return yield setRedisValue('indexIssues', issues, 300);
    }
});
