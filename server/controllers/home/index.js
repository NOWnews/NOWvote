
import express from 'express';
let router = express.Router();

import pageIndex from './page.index';

router.route('/')
    .get(pageIndex);

module.exports = router;
