import express from 'express';
let router = express.Router();

import actionCreate from './action.create';
import actionUpdate from './action.update';
import actionRemove from './action.remove';
import actionUpdateList from './action.updateList';

import pageList from './page.list';
import pageShow from './page.show';
import pageCreate from './page.create';
import pageUpdate from './page.update';




router.route('/')
    .get(pageList)
    .post(actionCreate)
    .put(actionUpdateList);

router.route('/create')
    .get(pageCreate);

router.route('/:sn')
    .get(pageShow)
    .put(actionUpdate)
    .delete(actionRemove);

router.route('/update/:sn')
    .put(actionUpdate)
    .get(pageUpdate);

module.exports = router;


