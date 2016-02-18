
import express from 'express';
import co from 'co';
let router = express.Router();

import models from '../models';
import caches from '../caches';

router.route('/:sn')
    .get(function(req, res, next) {

        co(function*() {

            const sn = parseInt(req.params.sn, 10);

            let cacheUser = yield caches.get(`USER${sn}`);

            if(cacheUser) {
                return res.json(cacheUser);
            }

            let user = yield models.user.findOne({sn: sn});

            if(user) {
                yield caches.set(`USER${user.sn}`, user, 30);
            }

            return res.json(user);
        });
    });

module.exports = router;