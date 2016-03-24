
import co from 'co';
import models from '../../../models';

const debug = require('debug')('NOWvote:admin:controllers:banner:page.list');

module.exports = function(req, res, next) {

    co(function*() {

        let banner = yield models.banner.find().execAsync();
        debug('banner = %j', banner);
        let items = yield models.banner.find()
            .where('trashed').equals(false)
            .sort({weight: 1})
            .execAsync();
        return res.render('banner/list', {items: items});
    })
    .catch(next);

};
