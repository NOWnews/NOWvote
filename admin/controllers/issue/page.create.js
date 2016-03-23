
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:issue:page.create');
const models = require('../../../models');

module.exports = function(req, res, next) {

    co(function*() {

        let categories = yield models.category.find()
            .where('trashed').equals(false)
            .execAsync();

        debug('categories = %j', categories);

        return res.render('issue/create', {
            categories: categories
        });
    })
    .catch(next);
};
