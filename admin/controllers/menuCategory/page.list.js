
const debug = require('debug')('NOWvote:admin:controllers:menuCategory:page.list');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    co(function*() {

        let items = yield models.menuCategory.find({ trashed: false }).sort({weight: 1}).execAsync();

        return res.render('menuCategory/list', {items: items});
    })
    .catch(next);

};
