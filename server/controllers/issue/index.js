
import express from 'express';
let router = express.Router();

import pageShow from './page.show';

router.route('issues/:sn')
    .get(pageShow);

module.exports = router;
