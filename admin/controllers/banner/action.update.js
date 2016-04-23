
import co from 'co';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const libs = require('../../../libs');
const debug = require('debug')('NOWvote:admin:controllers:banner:action.update');

// 處理圖片資料
const imageUrlMapping = co.wrap(function*(file, type) {

    if(!file) {
        return Promise.reject(new Error('File Needed'));
    }

    if(!type) {
        let type = 'picture';
    }

    let extName = libs.checkExt(file);
    let fileName = type + moment()
        .tz('Asia/Taipei')
        .format('YYYYMMDD-HHmmss');

    let fullFileName = `${fileName}.${extName}`;
    let newFileName = imageStorage + `/${fullFileName}`;

    return yield Promise.resolve({
        fullFileName: fullFileName,
        newFileName: newFileName
    });
});

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    let data = req.body;
    let imageStorageUrl = '/images';

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

        // 如果有更新 desktop banner 圖
        if(req.files && req.files.desktopBanner && req.files.desktopBanner[0]) {
            let file = req.files.desktopBanner[0];
            let desktopBannerInfo = yield imageUrlMapping(file, 'desktopBanner');
            let movedfilePosition = yield libs.moveFile(file.path, desktopBannerInfo.newFileName);
            let desktopImageUrl = `${imageStorageUrl}/${desktopBannerInfo.fullFileName}`;
            banner.set('desktopImage', desktopImageUrl);
        }

        // 如果有更新 mobile banner 圖
        if(req.files && req.files.mobileBanner && req.files.mobileBanner[0]) {
            let file = req.files.mobileBanner[0];
            let mobileBannerInfo = yield imageUrlMapping(file, 'mobileBanner');
            let movedfilePosition = yield libs.moveFile(file.path, mobileBannerInfo.newFileName);
            let mobileImageUrl = `${imageStorageUrl}/${mobileBannerInfo.fullFileName}`;
            banner.set('mobileImage', mobileImageUrl);
        }

        yield banner.saveAsync();

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('banner');

        return res.redirect('/banner');
    })
    .catch(next);
};
