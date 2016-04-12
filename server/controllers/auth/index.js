
import express from 'express';
let router = express.Router();

import actionLogout from './action.logout';
import authFail from './fail';
import authSuccess from './success';

router.route('/auto/logout')
    .get(actionLogout);

router.route('/auto/fail')
    .get(authFail);

router.route('/auto/success')
    .get(authSuccess);

module.exports = router;
