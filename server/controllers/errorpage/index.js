
import express from 'express';
let router = express.Router();

import pageShow from './page.show';

router.route('/404')
    .get(pageShow);

module.exports = router;
