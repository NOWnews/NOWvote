
import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const libs = require('../../../libs');
const debug = require('debug')('NOWvote:admin:controllers:sliderBanner:action.update');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    let data = req.body;
    let imageStorageUrl = '/images';
    let imgFile = req.file;

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

        let sliderBanner = yield models.sliderBanner.findOne()
            .where('sn').equals(sn)
            .execAsync();

        sliderBanner.set('title', data.title);
        sliderBanner.set('url', data.url);
        sliderBanner.set('desc', data.desc);
        sliderBanner.set('startTime', startTime);
        sliderBanner.set('endTime', endTime);
        sliderBanner.set('status', status);
        sliderBanner.set('continued', continued);

        // 檢查 圖片資訊
        if(imgFile){

            let extName = yield libs.checkExt(imgFile);
            let fileName = 'picture' + moment()
                .tz('Asia/Taipei')
                .format('YYYYMMDD-HHmmss');
            let fullFileName = `${fileName}.${extName}`;
            let newFileName = imageStorage + `/${fullFileName}`;

             // 呼叫 libs.moveFile 搬移檔案
            let movedfilePosition = yield libs.moveFile(imgFile.path, newFileName);
            let imageUrl = `${imageStorageUrl}/${fullFileName}`;

            sliderBanner.set('image', imageUrl);
        }

        yield sliderBanner.saveAsync();

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('sliderBanner');

        return res.redirect('/sliderBanner');
    })
    .catch(next);
};
