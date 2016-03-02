
import express from 'express';
let router = express.Router();

import pageHome from './page.demo';

router.route('/')
    .get(pageHome);

module.exports = router;
