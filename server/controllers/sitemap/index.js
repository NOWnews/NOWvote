
import express from 'express';
let router = express.Router();

const disableCache = require('../../middlewares/disableCache');

const sitemapXML = require('./sitemapXML');

router.route('/sitemap.xml')
    .get(sitemapXML);

module.exports = router;
