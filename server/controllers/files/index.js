import express from 'express';
let router = express.Router();

import robots from './robots';

router.route('/robots.txt')
    .get(robots);

module.exports = router;
