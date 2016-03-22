
const libs = require('../../../libs');
const debug = require('debug')('NOWvote:admin:controllers:ckeditor:action.upload');

import co from 'co';
import moment from 'moment-timezone';

module.exports = function(req, res, next) {

    let imageStorageUrl = '/images';
    let imgFile = req.files.upload[0];

    co(function*() {

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

        // ckeditor 需要設定的東西
        let ckeditorFuncNum = req.query.CKEditorFuncNum;
        let successMsg = '上傳文件成功';
        let html = `<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction('${ckeditorFuncNum}', '${imageUrl}', '${successMsg}');</script>`;

        res.send(html);
    })
    .catch(next);

};
