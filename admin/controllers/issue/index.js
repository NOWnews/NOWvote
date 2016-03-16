import express from 'express';
let router = express.Router();

import pageList from './page.list';
import pageCreate from './page.create';
// import pageUpdate from './page.update';
// import actionUpdateList from './action.updateList';
// import actionRemove from './action.remove';
// import actionUpdate from './action.update';
// import actionCreate from './action.create';

router.route('/')
    .get(pageList);
//     .put(actionUpdateList);
//
// router.route('/:sn')
//     .delete(actionRemove);
//
router.route('/create')
    .get(pageCreate);
//     .post(actionCreate);
//
// router.route('/update/:sn')
//     .put(actionUpdate)
//     .get(pageUpdate);

module.exports = router;
