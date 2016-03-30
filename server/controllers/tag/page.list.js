
import co from 'co';

const debug = require('debug')('NOWvote:server:controllers:tag:page.list');
const models = require('../../../models');

module.exports = function(req, res, next) {

    let tag = req.params.tag;

    debug('tag = %s', tag);

    co(function*() {

        let now = Date.now();

        let tagInIssues = yield models.issue.find()
            .where('trashed').equals(false)
            .where('status').equals(true)
            .where('tags').in([tag])
            .or([
                { continued: true },
                { startTime: { $lte: now }, endTime: { $gte: now } }
            ])
            .limit(30)
            .sort('-createdAt')
            .execAsync();


        debug('issue = %j', tagInIssues);

        return res.send(tag);
    })
    .catch(next);

};