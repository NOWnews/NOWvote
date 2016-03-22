
import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const libs = require('../../../libs');
const debug = require('debug')('NOWvote:admin:controllers:issue:action.create');

module.exports = function(req, res, next) {

    debug('req.body = %j', req.body);
    debug('req.files = %j', req.files);

    let data = req.body;
    let imageStorageUrl = '/images';
    let imgFile = req.files.file[0];
    let mainImgFile = req.files.mainImg[0];

    co(function*() {
        let status = data.status ? true : false;
        let continued = data.continued ? true : false;
        let startTime, endTime;
        let question = JSON.parse(data.question);

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
        let extImgName = yield libs.checkExt(imgFile);
        let extMainImgName = yield libs.checkExt(mainImgFile);

        let fileName = 'picture' + moment()
            .tz('Asia/Taipei')
            .format('YYYYMMDD-HHmmss');

        let fullImgName = `${fileName}.${extImgName}`;
        let fullMainImgName = `main_${fileName}.${extMainImgName}`;
        let newImgName = imageStorage + `/${fullImgName}`;
        let newMainImgName = imageStorage + `/${fullMainImgName}`;

         // 呼叫 libs.moveFile 搬移檔案
        let movedImgPosition = yield libs.moveFile(imgFile.path, newImgName);
        let movedMainImgPosition = yield libs.moveFile(mainImgFile.path, newMainImgName);

        let imgUrl = `${imageStorageUrl}/${fullImgName}`;
        let mainImgUrl = `${imageStorageUrl}/${fullMainImgName}`;

        debug('title = %j', data.title);
        debug('desc = %j', data.desc);
        debug('startTime = %j', startTime);
        debug('endTime = %j', endTime);
        debug('continued = %j', continued);
        debug('status = %j', status);
        debug('image = %j', imgUrl);
        debug('mainImage = %j', mainImgUrl);
        debug('question = %j', question);
        debug('tags = %j', data.tags);

        // 存入資料庫
        // let newIssue = yield models.issue.createAsync({
        //     title: data.title,
        //     desc: data.desc,
        //     startTime: startTime,
        //     endTime: endTime,
        //     status: status,
        //     image: imgUrl,
        //     mainImage: mainImgUrl,
        //     options: options,
        //     question: question,
        //     tags: tags,
        //     continued: continued
        // });

        return res.redirect('/issue');
    })
    .catch(next);
};
