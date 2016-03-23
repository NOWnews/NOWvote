
import co from 'co';

const debug = require('debug')('NOWvote:admin:controllers:issue:page.create');
const models = require('../../../models');

module.exports = function(req, res, next) {

    co(function*() {

        let categoris = yield models.menuCategory.find()
            .where('trashed').equals(false)
            .execAsync();

        debug('categoris = %j', categoris);

        return res.render('issue/create', {
            categoris: categoris
        });
    })
    .catch(next);
};
