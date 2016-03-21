
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

        // 如果常駐被勾起來，就不需要記錄時間
        if(continued){
            startTime = 0;
            endTime = 0;
        }else{
            startTime = moment( `${data.startAtDay} ${data.startAtHour}` );
            endTime = moment( `${data.endAtDay} ${data.endAtHour}` );
        }

        // 檢查 圖片資訊
        let extImgName = yield libs.checkExt(imgFile);
        let extMainImgName = yield libs.checkExt(mainImgFile);
        let fileName = 'picture' + moment()
            .tz('Asia/Taipei')
            .format('YYYYMMDD-HHmmss');

        let fullImgName = `${fileName}.${extImgName}`;
        let fullMainImgName = `${fileName}.${extMainImgName}`;
        let newImgName = imageStorage + `/${fullImgName}`;
        let newMainImgName = imageStorage + `/${fullMainImgName}`;

         // 呼叫 libs.moveFile 搬移檔案
        let movedImgPosition = yield libs.moveFile(imgFile.path, newImgName);
        let movedMainImgPosition = yield libs.moveFile(imgFile.path, newMainImgName);
        let imgUrl = `${imageStorageUrl}/${fullImgName}`;
        let mainImgUrl = `${imageStorageUrl}/${fullMainImgName}`;

        return res.redirect('/issue');
    })
    .catch(next);
};
