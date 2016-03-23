
const debug = require('debug')('NOWvote:server:controllers:demo');

import co from 'co';
import models from '../../../models';
import redis from '../../../caches';

module.exports = function(req, res, next) {

    co(function*() {


        res.send('issues');
        // return res.render('issues', {
        //     issues: issues,
        //     menuCategory: menuCategory,
        //     sliderBanner: sliderBanner
        // });
    })
    .catch(next);

};
