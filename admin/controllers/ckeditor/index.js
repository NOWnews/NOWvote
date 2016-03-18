import express from 'express';
let router = express.Router();

import actionUpload from './action.upload';

router.route('/fileUpload')
    .post(actionUpload);

module.exports = router;
