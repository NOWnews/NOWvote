import express from 'express';
let router = express.Router();

import pageList from './page.list';
import activeUpdateList from './active.updateList';
import activeRemove from './active.remove';
import pageCreate from './page.create';
import pageUpdate from './page.update';
import activeCreate from './active.create';
// import pageEdit from './page.edit';
// import pageDelete from './page.delete';

router.route('/')
    .get(pageList)
    .put(activeUpdateList);

router.route('/:sn')
    .delete(activeRemove);

router.route('/create')
    .get(pageCreate)
    .post(activeCreate)

router.route('/update/:sn')
    .get(pageUpdate)


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
