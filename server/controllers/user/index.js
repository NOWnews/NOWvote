
import express from 'express';
const router = express.Router();

const pageShow = require('./page.show');
const actionUpdate = require('./action.update');
const pageMeIssues = require('./page.meIssues');

router.route('/user/me/issues')
.get(pageMeIssues);

router.route('/user/me')
    .get(pageShow)
    .put(actionUpdate);

module.exports = router;
