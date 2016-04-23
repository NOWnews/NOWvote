
import co from 'co';
import moment from 'moment-timezone';

const debug = require('debug')('NOWvote:server:controllers:login:actionLogin');
const libs = require('../../../libs');

module.exports = function(req, res, next) {

    debug('req.body = %j', req.body);
    debug('req.file = %j', req.file);

    let imageStorageUrl = '/images';

    let file = req.file;

    co(function*() {

        debug('file = %j', file);

        let extName = libs.checkExt(file);
        let fileName = 'picture' + moment()
            .tz('Asia/Taipei')
            .format('YYYYMMDD-HHmmss');

        let fullFileName = `${fileName}.${extName}`;

        debug('extName = %s', extName);
        debug('fileName = %s', fileName);

        let newFileName = imageStorage + `/${fullFileName}`;

        // 呼叫 libs.moveFile 搬移檔案
        let movedfilePosition = yield libs.moveFile(file.path, newFileName);

        debug('movedfilePosition = %s', movedfilePosition);

        debug('image url = %s', `${imageStorageUrl}/${fullFileName}`);

        return res.redirect(`${imageStorageUrl}/${fullFileName}`);

        // return res.status(204).send();
    })
    .catch(next);
};
