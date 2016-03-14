
import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const libs = require('../../../libs');
const debug = require('debug')('NOWvote:admin:controllers:sliderBanner:action.create');

module.exports = function(req, res, next) {
    let data = req.body;
    let imageStorageUrl = '/images';
    let imgFile = req.file;

    co(function*() {
        let status = data.status ? true : false;
        let startTime = moment( `${data.startAtDay} ${data.startAtHour}` );
        let endTime = moment( `${data.endAtDay} ${data.endAtHour}` );

        // 檢查 圖片資訊
        let extName = yield libs.checkExt(imgFile);
        let fileName = 'picture' + moment()
            .tz('Asia/Taipei')
            .format('YYYYMMDD-HHmmss');

        let fullFileName = `${fileName}.${extName}`;
        let newFileName = imageStorage + `/${fullFileName}`;

         // 呼叫 libs.moveFile 搬移檔案
        let movedfilePosition = yield libs.moveFile(imgFile.path, newFileName);
        let imageUrl = `${imageStorageUrl}/${fullFileName}`;
        // 存入資料庫
        let newsliderBanner = yield models.sliderBanner.createAsync({
            title: data.title,
            desc: data.desc,
            url: data.url,
            startTime: startTime,
            endTime: endTime,
            status: status,
            image: imageUrl
        });

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('sliderBanner');

        return res.redirect('/sliderBanner');
    })
    .catch(next);
};
