
const debug = require('debug')('NOWvote:admin:controllers:menu');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    co(function*() {
        let issues = yield models.issue.find().execAsync();
        var items = [{ title: "foo", id: 1 }, { title: "bar", id: 2}, { title: "cool", id: 3 }];
        return res.render('menu', {items: items});
    })
    .catch(next);

};
