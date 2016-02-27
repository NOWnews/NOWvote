
import co from 'co';

const debug = require('debug')('NOWvote:server:controllers:login:actionLogin');
const libs = require('../../../libs');

module.exports = function(req, res, next) {

    debug('req.body = %j', req.body);
    debug('req.file = %j', req.file);

    let file = req.file;

    co(function*() {

        console.log('file = %j', file);

        let newFileName = imageStorage + '/test.png';

        // 呼叫 libs.moveFile 搬移檔案
        let movedfile = yield libs.moveFile(file.path, newFileName);

        debug('movedfile = %s', movedfile);

        return res.status(204).send();
    })
    .catch(next);
};