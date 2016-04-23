
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:user:page.userReceipt.list');
const models = require('../../../models');
const libs = require('../../../libs');

module.exports = function(req, res, next) {

    let currentPage = req.query.page || 1;
    let limit = 30;
    let skip = ( currentPage - 1 ) * limit;

    co(function*() {

        let results = yield [
            models.userReceipt.find()
                .where('trashed').equals(false)
                .populate('user')
                .execAsync(),

            models.userReceipt.find()
                .where('trashed').equals(false)
                .count()
                .execAsync()
        ];
        let userReceipts = results[0];
        let totalUserReceipts = results[1];
        debug('userReceipts = %j', userReceipts);
        debug('totalUserReceipts = %j', totalUserReceipts);

        // 處理 pagination
        let pageInfo = libs.pagination({
            total: totalUserReceipts,
            currnetPage: currentPage,
            limit: limit
        });
        debug('pageInfo = %j', pageInfo);

        return res.render('user/userReceiptList', {
            userReceipts: userReceipts,
            pageInfo: pageInfo
        });
    })
    .catch(next);
};
