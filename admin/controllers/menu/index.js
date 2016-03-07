import express from 'express';
let router = express.Router();

import pageMenu from './page.menu';
import pageCreate from './page.create';
// import pageEdit from './page.edit';
// import pageDelete from './page.delete';

router.route('/')
    .get(pageMenu);

router.route('/create')
    .get(pageCreate.show)
    .post(pageCreate.create);
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
