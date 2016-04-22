
import express from 'express';
let router = express.Router();

import page404 from './page.404';

router.route('/404')
    .get(page404);

module.exports = router;
