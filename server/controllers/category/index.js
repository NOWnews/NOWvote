
import express from 'express';
let router = express.Router();

const disableCache = require('../../middlewares/disableCache');

const pageList = require('./page.list');

router.route('/category/:category')
    .get(disableCache, pageList);

module.exports = router;
