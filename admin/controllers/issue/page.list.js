import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:issue:page.list');

module.exports = function(req, res, next) {

    co(function*() {

        // let items = yield models.issue.find()
        //     .where('trashed').equals(false)
        //     .sort({weight: 1})
        //     .execAsync();

        let issues = yield models.issue.find()
            // .populate('questions')
            .where('trashed').equals(false)
            .deepPopulate('questions.options')
            .limit(2)
            .execAsync();

        debug('issues = %j', issues);

        return res.render('issue/list', {issues: issues});
    })
    .catch(next);

};
