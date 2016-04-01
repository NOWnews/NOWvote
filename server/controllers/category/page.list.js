
import co from 'co';

const caches = require('../../../caches');
const models = require('../../../models');

const debug = require('debug')('NOWvote:server:controllers:category:page.list');

module.exports = function(req, res, next) {

    let categoryName = req.params.category;
    let currentPage = req.query.page || 1;
    let limit = 12;
    let skip = ( currentPage - 1 ) * 12;
    // let currentPage = req.query.page || 1;
    debug('categoryName = %s', categoryName);
    debug('limit = %s', limit);
    debug('skip = %s', skip);

    co(function*() {

        let now = Date.now();

        let category = yield models.category.findOne()
            .where('title').equals(categoryName)
            .where('trashed').equals(false)
            .where('status').equals(true)
            .or([
                { continued: true },
                { startTime: { $lte: now }, endTime: { $gte: now } }
            ])
            .execAsync();
        debug('category = %j', category);

        if(!category) {
            return yield Promise.reject(new Error('此分類無效'));
        }

        let categoryId = category._id;
        debug('categoryId = %s', categoryId);

        let isseusQuery = models.issue.find()
            .where('category').equals(categoryId)
            .where('trashed').equals(false)
            .where('status').equals(true)
            .or([
                { continued: true },
                { startTime: { $lte: now }, endTime: { $gte: now } }
            ])
            .limit(limit)
            .skip(skip);

        let countQuery = models.issue.find()
            .where('category').equals(categoryId)
            .where('trashed').equals(false)
            .where('status').equals(true)
            .or([
                { continued: true },
                { startTime: { $lte: now }, endTime: { $gte: now } }
            ])
            .count();

        // 找尋所有 issues 與總數量
        let results = yield [
            isseusQuery.execAsync(),
            countQuery.execAsync(),
        ];

        let issues = results[0];
        let issuesTotal = results[1];

        debug('issues = %j', issues);
        debug('issuesTotal = %d', issuesTotal);

        return res.json({
            issues: issues,
            issuesTotal: issuesTotal,
            currentPage: currentPage
        });
        // return res.render('category/list', { type: req.params.type, menu: menu });
    })
    .catch(next);
};
