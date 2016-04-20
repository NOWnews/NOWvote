
import co from 'co';
import Promise from 'bluebird';

const debug = require('debug')('NOWvote:server:controllers:vote:action.vote');
const models = require('../../../models');
const redis = require('../../../caches');

module.exports = function(req, res, next) {

    let userId = req.session.user._id;
    let data = req.body;
    debug('data = %j', data);

    co(function*() {

        let issueId = data.issueId;
        let issueSn = data.issueSn;
        let relationData = [];
        let optionsIds = [];

        // 處理傳進來的資料
        _.forEach(data.questions, function(question) {
            _.forEach(question.optionIds, function(optionId) {
                relationData.push({
                    user: userId,
                    issue: issueId,
                    question: question.questionId,
                    option: optionId
                });
                optionsIds.push(optionId);
            });
        });

        // 確認這個使用者是否投過票了
        let isVote = yield models.issueRelation.find()
            .where('user').equals(userId)
            .where('issue').equals(issueId)
            .execAsync()
            .then(function(relations) {
                debug('relations = %j', relations);
                if(relations.length > 0) {
                    return Promise.resolve(true);
                }
                return Promise.resolve(false);
            });

        if(isVote === true) {
            return Promise.reject(new Error('已經投票過了'));
        }

        // 這段 code 是逐一確認每個 options 與使用者個關係...
        // yield Promise.each(relationData, function(data) {
        //     return models.issueRelation.findOne()
        //         .where('user').equals(data.user)
        //         .where('issue').equals(data.issue)
        //         .where('question').equals(data.question)
        //         .where('option').equals(data.option)
        //         .execAsync()
        //         .then(function(aliveRelation) {
        //             debug('aliveRelation = %j', aliveRelation);
        //             if(aliveRelation) {
        //                 return Promise.reject(new Error('已經投票過了'));
        //             }

        //             return Promise.resolve();
        //         });
        // });

        debug('relationData = %j', relationData);

        let results = yield [
            models.issueRelation.createAsync(relationData),

            // 計算選項投票人數
            models.option.increaseCounterByIds(optionsIds),

            // 計算議題投票人數
            models.issue.increaseCounterById(issueId)
        ];

        // 重新更新 redis 裡面的首頁資料
        yield redis.updateRedisByKey('indexIssues');

        return res.json(relationData);
    })
    .catch(next);
};
