
import express from 'express';
let router = express.Router();

import authFail from './fail';
import authSuccess from './success';

router.route('/auto/fail')
    .get(authFail);

router.route('/auto/success')
    .get(authSuccess);

module.exports = router;
