
const debug = require('debug')('NOWvote:admin:controllers:menu');

import co from 'co';
import models from '../../../models';

// TODO 假資料
var aaa;
// -----------

module.exports = function(req, res, next) {

    co(function*() {
        let issues = yield models.issue.find().execAsync();
        // TODO 假資料
        if(!aaa){
            let testData = yield models.menuCategory.createAsync([{
                title: '標題111',
                desc:'簡短的',
                url: '123123',
                weight: 1,
                startTime: Date.now(),
                endTime: Date.now(),
                status: true
            },{
                title: '標題222',
                desc:'簡短的222',
                url: '55555',
                weight: 2,
                startTime: Date.now(),
                endTime: Date.now(),
                status: false
            },{
                title: '標題333',
                desc:'簡短的222',
                url: '55555',
                weight: 3,
                startTime: Date.now(),
                endTime: Date.now(),
                status: true
            }]);
            aaa = true;
        }
        // -----------

        let items = yield models.menuCategory.find().execAsync();
        return res.render('menuCategory/list', {items: items});
    })
    .catch(next);

};
