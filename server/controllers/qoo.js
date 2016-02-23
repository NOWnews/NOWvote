const debug = require('debug')('NOWvote:controllers:qoo');

import express from 'express';
import co from 'co';
let router = express.Router();

import models from '../models';
import caches from '../caches';

router.route('/')
    .get(function (req, res, next) {

        co(function* () {

            let newUser = yield models.user.createAsync({
                name: 'Simon',
                nickname: 'Simon',
                oauthType: 'GOOGLE',
                oauthId: '1112222'
            });

            return res.json(newUser);
        })
        .catch(next);
    });

module.exports = router;