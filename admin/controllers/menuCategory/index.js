import express from 'express';
let router = express.Router();

import pageList from './page.list';
import activeUpdateList from './active.updateList';
import activeRemove from './active.remove';
import pageCreate from './page.create';
// import pageEdit from './page.edit';
// import pageDelete from './page.delete';

router.route('/')
    .get(pageList)
    .put(activeUpdateList);

router.route('/:id')
    .delete(activeRemove);

router.route('/create')
    .get(pageCreate)
//     .post(pageCreate.create);
//
// router.route('/edit/:id')
//     .put(pageEdit.put)
//     .get(pageEdit.get);
//
// router.route('/sortable')
//     .post(pageSortable);
//
// router.route('/delete/:ids')
//     .delete(pageDelete);


module.exports = router;
