import express from 'express';
let router = express.Router();

import actionUpload from './action.upload';

// 驗證是否登入
const isLogin = require('../../middlewares/isLogin');

router.route('/fileUpload')
    .post(isLogin, actionUpload);

module.exports = router;
