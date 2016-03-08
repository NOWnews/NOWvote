import express from 'express';
let router = express.Router();

import pageList from './page.list';
import pageCreate from './page.create';
import pageUpdate from './page.update';
import activeUpdateList from './active.updateList';
import activeRemove from './active.remove';
import activeUpdate from './active.update';
import activeCreate from './active.create';

router.route('/')
    .get(pageList)
    .put(activeUpdateList);

router.route('/:sn')
    .delete(activeRemove);

router.route('/create')
    .get(pageCreate)
    .post(activeCreate);

router.route('/update/:sn')
    .put(activeUpdate)
    .get(pageUpdate);

module.exports = router;
