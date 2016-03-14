
import express from 'express';
let router = express.Router();

import pageHome from './page.home';

router.route('/')
    .get(pageHome);

router.route('/index')
    .get(pageHome);

module.exports = router;