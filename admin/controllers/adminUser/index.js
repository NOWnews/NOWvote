import express from 'express';
let router = express.Router();

const pageList = require('./page.list');
const pageUpdate = require('./page.update');
const pageCreate = require('./page.create');
const actionCreate = require('./action.create');
const actionUpdate = require('./action.update');
const actionRemove = require('./action.remove');

// 確認這個 adminUser 是否存在的 middleware
const checkAdminUserAlive = require('../../middlewares/checkAdminUserAlive');

// 驗證是否登入
const isLogin = require('../../middlewares/isLogin');

router.route('/')
    .post(checkAdminUserAlive, isLogin, actionCreate)
    .get(isLogin, pageList);

router.route('/create')
    .get(isLogin, pageCreate);

router.route('/:sn')
    .get(isLogin, pageUpdate)
    .patch(isLogin, actionUpdate)
    .delete(isLogin, actionRemove);

module.exports = router;
