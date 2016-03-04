import express from 'express';
let router = express.Router();

import pageCarousel from './page.carousel';

router.route('/')
    .get(pageCarousel);

module.exports = router;
