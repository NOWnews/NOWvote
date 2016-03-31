
import express from 'express';
let router = express.Router();

const pageList = require('./page.list');

router.route('/category/:category')
    .get(pageList);

module.exports = router;
