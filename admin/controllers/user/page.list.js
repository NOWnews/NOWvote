
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:user:page.list');
const models = require('../../../models');
const libs = require('../../../libs');

module.exports = function(req, res, next) {

    let currentPage = req.query.page || 1;
    let limit = 30;
    let skip = ( currentPage - 1 ) * limit;

    co(function*() {

        let results = yield [
            models.user.find()
                .where('trashed').equals(false)
                .limit(limit)
                .skip(skip)
                .execAsync(),

            models.user.find()
                .where('trashed').equals(false)
                .count()
                .execAsync()
        ];

        let users = results[0];
        let totalUser = results[1];
        debug('users = %j', users);
        debug('totalUser = %d', totalUser);

        // 處理 pagination
        let pageInfo = libs.pagination({
            total: totalUser,
            currnetPage: currentPage,
            limit: limit
        });
        debug('pageInfo = %j', pageInfo);

        return res.render('user/list', {
            users: users,
            pageInfo: pageInfo
        });

    })
    .catch(next);
};