
import express from 'express';
let router = express.Router();

const pageList = require('./page.list');

router.route('/tag/:tag')
    .get(pageList);

module.exports = router;