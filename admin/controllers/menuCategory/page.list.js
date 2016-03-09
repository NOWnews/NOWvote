import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:menuCategory:page.list');

module.exports = function(req, res, next) {

    co(function*() {

        let items = yield models.menuCategory.find()
            .where('trashed').equals(false)
            .sort({weight: 1})
            .execAsync();

        return res.render('menuCategory/list', {items: items});
    })
    .catch(next);

};
