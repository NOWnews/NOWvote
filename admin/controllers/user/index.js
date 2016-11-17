
import express from 'express';
let router = express.Router();

const pageList = require('./page.list.js');
const pageShow = require('./page.show.js');
const pageIssueList = require('./page.issue.list.js');
const pageIssueShow = require('./page.issue.show.js');
const pageUserReceiptList = require('./page.userReceipt.list.js');

// 驗證是否登入
const isLogin = require('../../middlewares/isLogin');

router.route('/')
    .get(isLogin, pageList);

router.route('/receipts')
    .get(isLogin, pageUserReceiptList);

router.route('/:sn')
    .get(isLogin, pageShow);

router.route('/:sn/issues')
    .get(isLogin, pageIssueList);

router.route('/:sn/issues/:issueSn')
    .get(isLogin, pageIssueShow);

module.exports = router;
