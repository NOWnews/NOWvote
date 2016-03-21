
import express from 'express';
let router = express.Router();

import pageHome from './page.home';

// 驗證是否登入
const isLogin = require('../../middlewares/isLogin');

router.route('/')
    .get(isLogin, pageHome);

module.exports = router;