
import express from 'express';
let router = express.Router();

import authFail from './fail';
import authSuccess from './success';

router.route('/fail')
    .get(authFail);

router.route('/success')
    .get(authSuccess);

module.exports = router;
