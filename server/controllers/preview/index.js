
import express from 'express';
let router = express.Router();

import pageShow from './page.show';

router.route('/previews/:token')
    .get(pageShow);

module.exports = router;