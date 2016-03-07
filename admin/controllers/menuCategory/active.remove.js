
const debug = require('debug')('NOWvote:admin:controllers:menu');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {

    co(function*() {
        let issues = yield models.issue.find().execAsync();
        let paramsId = req.params['id'];
        let deleteData = yield models.menuCategory.findOne({sn: paramsId}).execAsync();
        deleteData.trashed = true;
        deleteData.save();
        return res.json(deleteData);
    })
    .catch(next);

};
