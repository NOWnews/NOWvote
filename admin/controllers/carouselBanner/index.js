import express from 'express';
let router = express.Router();

import actionCreate from './action.create';
import actionUpdate from './action.update';
import actionRemove from './action.remove';
import pageList from './page.list';
import pageShow from './page.show';

router.route('/')
    .get(pageList)
    .post(actionCreate);

router.route('/:sn')
    .get(pageShow)
    .put(actionUpdate)
    .delete(actionRemove);

module.exports = router;
