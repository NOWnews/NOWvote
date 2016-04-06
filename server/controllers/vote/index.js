
import express from 'express';
let router = express.Router();

import actionVote from './action.vote';

router.route('/vote/')
    .post(actionVote);

module.exports = router;
