import express from 'express';
let router = express.Router();

import pageContent from './page.content';

router.route('/')
    .get(pageContent);

module.exports = router;
