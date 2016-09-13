
import co from 'co';
import is from 'is_js';
import mongoose from 'mongoose';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const libs = require('../../../libs');
const debug = require('debug')('NOWvote:admin:controllers:issue:action.create');

// TODO: 這列邏輯很亂，之後還要重新整理過
module.exports = function(req, res, next) {

    debug('req.body = %j', req.body);
    debug('req.files = %j', req.files);

    let data = req.body;
    let imageStorageUrl = '/images';

    co(function*() {
        let status = data.status ? true : false;
        let continued = data.continued ? true : false;
        let startTime, endTime;
        let questions = JSON.parse(data.question);

        // 如果常駐被勾起來，就不需要記錄時間
        if(continued){
            startTime = 0;
            endTime = 0;
        }else{
            startTime = moment( `${data.startAtDay} ${data.startAtHour}` );
            endTime = moment( `${data.endAtDay} ${data.endAtHour}` );
        }

        //---- 圖片的處理 ----
        // 檢查 圖片資訊

        // 檢查列表頁縮圖
        let imgUrl = '/static/images/issueDefault300x250.png';
        if(req.files && req.files.file){
            let imgFile = req.files.file[0];
            let extImgName = libs.checkExt(imgFile);

            let fileName = 'picture' + moment()
                .tz('Asia/Taipei')
                .format('YYYYMMDD-HHmmss');
            let fullImgName = `${fileName}.${extImgName}`;

            let newImgName = `${imageStorage}/${fullImgName}`;
            let movedImgPosition = yield libs.moveFile(imgFile.path, newImgName);
            imgUrl = `${imageStorageUrl}/${fullImgName}`;
        }

        // 檢查列表頁縮圖
        let mainImgUrl = '/static/images/issueDefault930x400.png';
        if(req.files && req.files.mainImg){
            let mainImgFile = req.files.mainImg[0];
            let extMainImgName = libs.checkExt(mainImgFile);

            let mainImageName = 'issue' + moment()
                .tz('Asia/Taipei')
                .format('YYYYMMDD-HHmmss');
            let fullMainImgName = `${mainImageName}.${extMainImgName}`;
            let newMainImgName = `${imageStorage}/${fullMainImgName}`;
            let movedMainImgPosition = yield libs.moveFile(mainImgFile.path, newMainImgName);
            mainImgUrl = `${imageStorageUrl}/${fullMainImgName}`;
        }

        debug('title = %j', data.title);
        debug('category = %j', data.category);
        debug('desc = %j', data.desc);
        debug('startTime = %j', startTime);
        debug('endTime = %j', endTime);
        debug('continued = %j', continued);
        debug('status = %j', status);
        debug('image = %j', imgUrl);
        debug('mainImage = %j', mainImgUrl);
        debug('questions = %j', questions);
        debug('multiselect = %j', data.multiselect);
        debug('tags = %j', data.tags);

        let newIssueId = mongoose.Types.ObjectId();
        let newIssue = {
            _id: newIssueId,
            title: data.title,
            status: status,
            desc: data.desc || 'NOWnews',
            counter: 0,
            mainImage: mainImgUrl,
            thumbnail: imgUrl,
            startTime: startTime,
            endTime: endTime,
            continued: continued,
            questions: [],
            category: data.category,
            tags: []
        };

        let questionsData = [];
        let optionsData = [];

        // 處理 issue 的 tags
        if(data.tags && is.array(data.tags) && data.tags.length > 0){
            newIssue.tags = data.tags;
        }

        _.forIn(questions, function(question) {

            // option id 的陣列，要存入 question
            let optionIds = [];

            // 處理 option 的資料
            if(question.option && question.option.length !== 0){
                _.forEach(question.option, function(option) {

                    // 產生新的 option objectId 並存入陣列，要給 question 用的
                    let newOptionId = mongoose.Types.ObjectId();
                    optionIds.push(newOptionId);

                    // 產生新的 option object 推入陣列，等等要一次存進 option
                    let newOption = {};
                    newOption._id = newOptionId;
                    newOption.content = option;
                    optionsData.push(newOption);
                });
            }

            // 產生新的 question objectId 並存入陣列，要給 issue 用的
            let newQuestionId = mongoose.Types.ObjectId();
            newIssue.questions.push(newQuestionId);

            // 產生新的 question 推入陣列，等等要一次存進 question
            let newQuestion = {};
            newQuestion._id = newQuestionId;
            newQuestion.content = question.name;
            newQuestion.options = optionIds;
            newQuestion.multiselect = question.multiselect;
            questionsData.push(newQuestion);
        });

        debug('new issue data = %j', newIssue);
        debug('new question data = %j', questionsData);
        debug('new options data = %j', optionsData);

        // 確認這個議題還是投票
        if(newIssue.questions.length !== 0) {
            newIssue.type = 'VOTE';
        }

        // 將所有資料存入資料庫
        yield [
            models.issue.createAsync(newIssue),
            models.question.createAsync(questionsData),
            models.option.createAsync(optionsData)
        ];

        // 更新首頁 redis issue 與 hotIssues
        yield [
            redis.updateRedisByKey('indexIssues'),
            redis.updateRedisByKey('hotIssues')
        ];

        return res.redirect('/issue');
    })
    .catch(next);
};
