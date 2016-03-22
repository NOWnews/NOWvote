import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:issue:page.list');

module.exports = function(req, res, next) {

    co(function*() {

        let items = yield models.issue.find()
            .where('trashed').equals(false)
            .sort({weight: 1})
            .execAsync();

        return res.render('issue/list', {items: items});
    })
    .catch(next);

};
