
import express from 'express';
let router = express.Router();

import actionVote from './action.vote';

router.route('/vote/:sn')
    .get(actionVote);

module.exports = router;
