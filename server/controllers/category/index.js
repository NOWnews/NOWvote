
import express from 'express';
let router = express.Router();

const pageList = require('./page.list');
const pageShow = require('./page.show');

router.route('/category/:category')
    .get(pageList);

router.route('/category/:category/:sn')
    .get(pageShow);

module.exports = router;
