import express from 'express';
let router = express.Router();

const pageLogin = require('./page.login');
const actionLogin = require('./action.login');
const actionLogout = require('./action.logout');

router.route('/login')
    .get(pageLogin)
    .post(actionLogin);

router.route('/logout')
    .get(actionLogout);

module.exports = router;