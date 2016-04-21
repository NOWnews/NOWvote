import express from 'express';
let router = express.Router();

import pageList from './page.list';
import pageCreate from './page.create';
import pageUpdate from './page.update';
import actionUpdateList from './action.updateList';
import actionRemove from './action.remove';
import actionUpdate from './action.update';
import actionCreate from './action.create';
import actionPreview from './action.preview';

// 驗證是否登入
const isLogin = require('../../middlewares/isLogin');

router.route('/')
    .get(isLogin, pageList)
    .put(isLogin, actionUpdateList);

router.route('/:sn')
    .delete(isLogin, actionRemove);

router.route('/create')
    .get(isLogin, pageCreate)
    .post(isLogin, actionCreate);

router.route('/update/:sn')
    .put(isLogin, actionUpdate)
    .get(isLogin, pageUpdate);

router.route('/preview')
    .post(isLogin, actionPreview);

module.exports = router;
