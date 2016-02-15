
import express from 'express';
let router = express.Router();

import models from '../models';
import caches from '../caches';

router.route('/')
    .get(async function (req, res, next) {
        var a = await caches.getAsync('foo');
        return res.send(a);
    });

module.exports = router;