
import express from 'express';
let router = express.Router();

const pageList = require('./page.list');
const pageShow = require('./page.show');

router.route('/:type')
    .get(pageList);

router.route('/:type/:sn')
    .get(pageShow);

module.exports = router;