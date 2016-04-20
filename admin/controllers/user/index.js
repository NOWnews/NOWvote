
import express from 'express';
let router = express.Router();

const pageList = require('./page.list.js');
const pageShow = require('./page.show.js');
const pageIssueList = require('./page.issue.list.js');
const pageIssueShow = require('./page.issue.show.js');

router.route('/')
    .get(pageList);

router.route('/:sn')
    .get(pageShow);

router.route('/:sn/issues')
    .get(pageIssueList);

router.route('/:sn/issues/:issueSn')
    .get(pageIssueShow);

module.exports = router;