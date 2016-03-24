import express from 'express';
let router = express.Router();

import actionCreate from './action.create';
import actionUpdate from './action.update';
import actionRemove from './action.remove';
import actionUpdateList from './action.updateList';

import pageList from './page.list';
import pageCreate from './page.create';
import pageUpdate from './page.update';

router.route('/')
    .get(pageList)
    .put(actionUpdateList);

router.route('/:sn')
    .delete(actionRemove);

router.route('/create')
    .get(pageCreate)
    .post(actionCreate);

router.route('/update/:sn')
    .put(actionUpdate)
    .get(pageUpdate);

module.exports = router;


