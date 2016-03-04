import express from 'express';
let router = express.Router();

import pageMenu from './page.menu';

router.route('/')
    .get(pageMenu);

module.exports = router;
