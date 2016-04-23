
import express from 'express';
let router = express.Router();

const disableCache = require('../../middlewares/disableCache');

const pageIndex = require('./page.index');

router.route('/')
    .get(disableCache, pageIndex);

module.exports = router;
