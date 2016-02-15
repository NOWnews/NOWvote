
import express from 'express';
let router = express.Router();

import models from '../models';
import caches from '../caches';

router.route('/')
    .get(function(req, res, next) {
        return res.send('ok');
    });

module.exports = router;