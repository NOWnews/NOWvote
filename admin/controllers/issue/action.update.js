
import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const libs = require('../../../libs');
const debug = require('debug')('NOWvote:admin:controllers:issue:action.update');

// TODO: 這列邏輯很亂，之後還要重新整理過
module.exports = function(req, res, next) {

    debug('req.body = %j', req.body);
    debug('req.files = %j', req.files);

    let sn = parseInt(req.params.sn, 10);
    let data = req.body;
    let imageStorageUrl = '/images';
    let imgFile = req.files.file;
    let mainImgFile = req.files.mainImg;

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

        let issue = yield models.issue.findOne()
            .deepPopulate('questions.options')
            .where('sn').equals(sn)
            .execAsync();

        issue.set('title', data.title);
        issue.set('desc', data.desc);
        issue.set('category', data.category);
        issue.set('startTime', startTime);
        issue.set('endTime', endTime);
        issue.set('status', status);
        issue.set('continued', continued);

        debug('issue = %j', issue);

        // 檢查 主圖資訊
        if(mainImgFile){
            let extMainImgName = yield libs.checkExt(mainImgFile[0]);
            let mainImageName = 'issue' + moment()
                .tz('Asia/Taipei')
                .format('YYYYMMDD-HHmmss');
            let fullMainImgName = `${mainImageName}.${extMainImgName}`;
            let newMainImgName = `${imageStorage}/${fullMainImgName}`;

            // 呼叫 libs.moveFile 搬移檔案
            let movedMainImgPosition = yield libs.moveFile(mainImgFile[0].path, newMainImgName);
            let mainImgUrl = `${imageStorageUrl}/${fullMainImgName}`;

            issue.set('mainImage', mainImgUrl);
        }

        // 檢查 縮圖資訊
        if(imgFile){
            let extName = yield libs.checkExt(imgFile[0]);
            let fileName = 'picture' + moment()
                .tz('Asia/Taipei')
                .format('YYYYMMDD-HHmmss');
            let fullFileName = `${fileName}.${extName}`;
            let newFileName = imageStorage + `/${fullFileName}`;

             // 呼叫 libs.moveFile 搬移檔案
            let movedfilePosition = yield libs.moveFile(imgFile[0].path, newFileName);
            let imageUrl = `${imageStorageUrl}/${fullFileName}`;

            issue.set('thumbnail', imageUrl);
        }

        yield issue.saveAsync();

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('indexIssues');

        return res.redirect('/issue');
    })
    .catch(next);
};
