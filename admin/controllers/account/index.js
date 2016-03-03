import express from 'express';
let router = express.Router();

import pageAccount from './page.account';

router.route('/')
    .get(pageAccount);

module.exports = router;
