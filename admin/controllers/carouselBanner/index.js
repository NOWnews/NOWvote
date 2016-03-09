import express from 'express';
let router = express.Router();

import actionCreate from './action.create';
import actionUpdate from './action.update';
import actionRemove from './action.remove';
import pageList from './page.list';
import pageShow from './page.show';
import pageCreate from './page.create';

router.route('/')
    .get(pageList)
    .post(actionCreate);

router.route('/create')
    .get(pageCreate);

router.route('/:sn')
    .get(pageShow)
    .put(actionUpdate)
    .delete(actionRemove);

module.exports = router;
