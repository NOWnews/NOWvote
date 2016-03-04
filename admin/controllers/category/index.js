import express from 'express';
let router = express.Router();

import pageCategory from './page.category';

router.route('/')
    .get(pageCategory);

module.exports = router;
