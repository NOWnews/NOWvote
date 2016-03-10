
const debug = require('debug')('NOWvote:admin:controllers:carouselBanner:action.create');

import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
const libs = require('../../../libs');

module.exports = function(req, res, next) {
    let data = req.body;
    let imageStorageUrl = '/images';
    let imgFile = req.file;

    console.log(data);
    console.log(imgFile);
    co(function*() {
        let status = data.status ? true : false;
        let startTime = moment( `${data.startAtDay} ${data.startAtHour}` );
        let endTime = moment( `${data.endAtDay} ${data.endAtHour}` );

        debug('imgFile = %j', imgFile);
        // 檢查 圖片資訊
        let extName = yield libs.checkExt(imgFile);
        let fileName = 'picture' + moment()
            .tz('Asia/Taipei')
            .format('YYYYMMDD-HHmmss');

        let fullFileName = `${fileName}.${extName}`;

        debug('extName = %s', extName);
        debug('fileName = %s', fileName);
        let newFileName = imageStorage + `/${fullFileName}`;


         // 呼叫 libs.moveFile 搬移檔案
        let movedfilePosition = yield libs.moveFile(imgFile.path, newFileName);

        debug('movedfilePosition = %s', movedfilePosition);

        debug('image url = %s', `${imageStorageUrl}/${fullFileName}`);

        let imageUrl = `${imageStorageUrl}/${fullFileName}`;
        // 存入資料庫
        let newCarouselBanner = yield models.sliderBanner.createAsync({
            title: data.title,
            desc: data.desc,
            url: data.url,
            startTime: startTime,
            endTime: endTime,
            status: status,
            image: imageUrl
        });
        debug('newCarouselBanner = %j', newCarouselBanner);

        return res.redirect('/carouselBanner');
    })
    .catch(next);
};
