
import express from 'express';
let router = express.Router();

import authFail from './fail';
import authSuccess from './success';

router.route('/auth/fail')
    .get(authFail);

router.route('/auth/success')
    .get(authSuccess);

module.exports = router;