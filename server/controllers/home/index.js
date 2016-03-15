
import express from 'express';
let router = express.Router();

import pageHome from './page.home';
import pageDemo from './page.demo';

router.route('/')
    .get(pageHome);

router.route('/index')
    .get(pageHome);

router.route('/demo')
    .get(pageDemo);
module.exports = router;
