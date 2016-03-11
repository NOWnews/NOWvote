
const debug = require('debug')('NOWvote:admin:controllers:carouselBanner:action.update');

import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
const libs = require('../../../libs');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    let data = req.body;
    let imageStorageUrl = '/images';
    let imgFile = req.file;

    co(function*() {

        let status = data.status ? true : false;
        let startTime = moment( `${data.startAtDay} ${data.startAtHour}` );
        let endTime = moment( `${data.endAtDay} ${data.endAtHour}` );

        let sliderBanner = yield models.sliderBanner.findOne()
            .where('sn').equals(sn)
            .execAsync();

        sliderBanner.set('title', data.title);
        sliderBanner.set('url', data.url);
        sliderBanner.set('desc', data.desc);
        sliderBanner.set('startTime', startTime);
        sliderBanner.set('endTime', endTime);
        sliderBanner.set('status', status);

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
        return res.redirect('/carouselBanner');
    })
    .catch(next);
};
