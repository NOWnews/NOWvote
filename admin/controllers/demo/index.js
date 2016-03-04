import express from 'express';
let router = express.Router();

import pageDemo from './page.demo';

router.route('/')
    .get(pageDemo);

module.exports = router;
