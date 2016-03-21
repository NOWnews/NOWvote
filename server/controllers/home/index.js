
import express from 'express';
let router = express.Router();

import pageHome from './page.home';
import pageDemo from './page.demo';
import pageIndex from './page.index';

router.route('/')
    .get(pageHome);

router.route('/index')
    .get(pageHome);

router.route('/demo')
    .get(pageDemo);

router.route('/newindex')
    .get(pageIndex);

module.exports = router;
