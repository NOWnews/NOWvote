
const debug = require('debug')('NOWvote:admin:controllers:carouselBanner:action.create');

import co from 'co';
import models from '../../../models';

module.exports = function(req, res, next) {
    let data = req.body;
    let imgFile = req.file;
    console.log(data);
    console.log(imgFile);
    co(function*() {

    })
    .catch(next);
};
