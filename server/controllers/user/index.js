
import express from 'express';
const router = express.Router();

const pageShow = require('./page.show');
const actionUpdate = require('./action.update');
const pageMyIssues = require('./page.myIssues');

router.route('/user/me')
    .get(pageShow)
    .put(actionUpdate);

router.route('/user/me/issues')
    .get(pageMyIssues);

module.exports = router;
