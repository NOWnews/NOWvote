

import express from 'express';
let router = express.Router();

const pageLogin = require('./page.login');

router.route('/login')
    .get(pageLogin);

module.exports = router;