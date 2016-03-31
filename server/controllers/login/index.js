
import express from 'express';
let router = express.Router();

const pageLogin = require('./page.login');
const actionLogin = require('./action.login');

router.route('/login')
    .get(pageLogin)
    .post(actionLogin);

module.exports = router;
