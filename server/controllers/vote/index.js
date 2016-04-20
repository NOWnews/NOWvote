
import express from 'express';
let router = express.Router();

import actionVote from './action.vote';

// 驗證是否登入
const isLogin = require('../../middlewares/isLogin');

router.route('/vote/')
    .post(isLogin, actionVote);

module.exports = router;
