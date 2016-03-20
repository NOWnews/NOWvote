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


router.route('/')
    .post(checkAdminUserAlive, actionCreate)
    .get(pageList);

router.route('/create')
    .get(pageCreate);

router.route('/:sn')
    .get(pageUpdate)
    .patch(actionUpdate)
    .delete(actionRemove);

module.exports = router;