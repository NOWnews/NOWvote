
import express from 'express';
let router = express.Router();

import actionLogout from './action.logout';
import authFail from './fail';
import authSuccess from './success';

router.route('/auth/logout')
    .get(actionLogout);

router.route('/auth/fail')
    .get(authFail);

router.route('/auth/success')
    .get(authSuccess);

module.exports = router;
