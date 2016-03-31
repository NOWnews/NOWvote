
import express from 'express';
let router = express.Router();

import pageDemo from './page.demo';
import pageIndex from './page.index';

router.route('/')
    .get(pageIndex);

router.route('/index')
    .get(pageIndex);

router.route('/demo')
    .get(pageIndex);

module.exports = router;
