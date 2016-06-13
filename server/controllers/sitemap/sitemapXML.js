
const debug = require('debug')('NOWvote:server:controllers:sitemap:sitemapXML');

import sm from 'sitemap';
import moment from 'moment-timezone';
import co from 'co';
import Promise from 'bluebird';

const models = require('../../../models');

module.exports = function(req, res, next) {

    co(function*() {

        // 找出所有議題或投票
        let issues = yield models.issue.find()
            .where('trashed', false)
            .sort({_id: -1})
            .limit(1000)
            .execAsync();
        debug('issues = %j', issues);

        // sitemap 資料初始化
        let sitemapOptinos = {
            hostname: 'http://vote.nownews.com',
            cacheTime: 600000,
            urls: []
        };

        // sitemap 資料處理
        let urls = issues.map(function(issue) {
            return {
                url: `http://vote.nownews.com/issues/${issue.sn}`,
                changefreq: 'daily',
                priority: 1,
                lastmodISO: issue.updatedAt
            };
        });

        sitemapOptinos.urls = urls;

        let sitemap = sm.createSitemap(sitemapOptinos);

        // 轉換成 sitemap xml
        let sitemapXML = yield new Promise(function(resolve, reject) {
            sitemap.toXML(function(err, xml) {
                if (err) {
                    return reject(err);
                }
                return resolve(xml);
            });
        });

        res.header('Content-Type', 'application/xml');
        return res.send(sitemapXML);
    })
    .catch(next);
};