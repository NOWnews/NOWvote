
import express from 'express';
let router = express.Router();

const pageList = require('./page.list');
const pageShow = require('./page.show');

router.route('/:category')
    .get(pageList);

router.route('/:category/:sn')
    .get(pageShow);

module.exports = router;
