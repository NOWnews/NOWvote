
import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const libs = require('../../../libs');
const debug = require('debug')('NOWvote:admin:controllers:banner:action.update');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    let data = req.body;
    let imageStorageUrl = '/images';
    let imgFile = req.files.file;

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

        let banner = yield models.banner.findOne()
            .where('sn').equals(sn)
            .execAsync();

        banner.set('title', data.title);
        banner.set('url', data.url);
        banner.set('desc', data.desc);
        banner.set('startTime', startTime);
        banner.set('endTime', endTime);
        banner.set('status', status);
        banner.set('continued', continued);

        // 檢查 圖片資訊
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

            banner.set('image', imageUrl);
        }

        yield banner.saveAsync();

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('banner');

        return res.redirect('/banner');
    })
    .catch(next);
};
