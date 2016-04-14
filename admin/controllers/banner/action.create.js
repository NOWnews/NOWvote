
import co from 'co';
import Promise from 'bluebird';
import moment from 'moment-timezone';
import models from '../../../models';
import redis from '../../../caches';

const libs = require('../../../libs');
const debug = require('debug')('NOWvote:admin:controllers:banner:action.create');

// 處理圖片資料
const imageUrlMapping = co.wrap(function*(file, type) {

    if(!file) {
        return Promise.reject(new Error('File Needed'));
    }

    if(!type) {
        let type = 'picture';
    }

    let extName = yield libs.checkExt(file);
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
    let data = req.body;
    let imageStorageUrl = '/images';
    let desktopBanner = req.files.desktopBanner[0];
    let mobileBanner = req.files.mobileBanner[0];

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

        // 處理 desktop 與 mobile 圖片資訊與名稱
        let imagesInfo = yield [
            imageUrlMapping(desktopBanner, 'desktopBanner'),
            imageUrlMapping(mobileBanner, 'mobileBanner')
        ];

        let desktopBannerInfo = imagesInfo[0];
        let mobileBannerInfo = imagesInfo[1];

        debug('desktopBannerInfo = %j', desktopBannerInfo);
        debug('mobileBannerInfo = %j', mobileBannerInfo);

        // 搬移檔案位置
        let bannerNames = yield [
            libs.moveFile(desktopBanner.path, desktopBannerInfo.newFileName),
            libs.moveFile(mobileBanner.path, mobileBannerInfo.newFileName)
        ];

        let desktopImageUrl = `${imageStorageUrl}/${desktopBannerInfo.fullFileName}`;
        let mobileImageUrl = `${imageStorageUrl}/${mobileBannerInfo.fullFileName}`;

        // 存入資料庫
        let newBanner = yield models.banner.createAsync({
            title: data.title,
            desc: data.desc,
            url: data.url,
            startTime: startTime,
            endTime: endTime,
            status: status,
            desktopImage: desktopImageUrl,
            mobileImage: mobileImageUrl,
            continued: continued
        });

        // 讓 redis 重整資料，只更新前台會用到的資料
        yield redis.updateRedisByKey('banner');

        return res.redirect('/banner');
    })
    .catch(next);
};
