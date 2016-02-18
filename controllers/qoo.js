const debug = require('debug')('NOWvote:controllers:qoo');

import express from 'express';
let router = express.Router();

import models from '../models';
import caches from '../caches';

router.route('/')
    .get(async function (req, res, next) {
        var a = await caches.getAsync('foo');
        debug(a);
        return res.send(a);
    });

module.exports = router;