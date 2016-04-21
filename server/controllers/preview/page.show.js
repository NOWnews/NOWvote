
import co from 'co';
import is from 'is_js';
import Promise from 'bluebird';

const redis = require('../../../caches');
const libs = require('../../../libs');

module.exports = function(req, res, next) {

    let token = req.params.token;
    co(function*() {

        let previewData = yield redis.getRedisValue(token);

        if(is.array(previewData) && previewData.length === 0) {
            let err = libs.errorWrapper(10404, '找不到頁面', 'page', new Error());
            return Promise.reject(err);
        }

        return res.render('issue/preview.html', {
            previewData: previewData
        });
    })
    .catch(next);
};