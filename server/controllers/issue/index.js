
import express from 'express';
let router = express.Router();

import pageIssue from './page.issue';

router.route('/')
    .get(pageIssue);


module.exports = router;
