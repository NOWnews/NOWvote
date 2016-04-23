
import Promise from 'bluebird';
import co from 'co';
import moment from 'moment-timezone';
import iconv from 'iconv-lite';

const debug = require('debug')('NOWvote:admin:controllers:issue:action.exportUser');
const json2csv = Promise.promisify(require('json2csv'));
const models = require('../../../models');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    co(function*() {

        let issue = yield models.issue.findBySn(sn);

        let relations = yield models.issueRelation.find()
            .where('issue').equals(issue._id)
            .populate('user')
            .execAsync();

        let users = [];

        _.forEach(relations, function(relation) {

            if(!relation.user) {
                return;
            }

            users.push(relation.user);
            return;
        });
        debug('users = %j', users);

        let fields = ['name', 'email', 'address', 'gender', 'phone'];

        let data = _.map(users, function(user) {
            return {
                'name': user.name,
                'email': user.email || '',
                'address': user.address || '',
                'gender': user.gender || '',
                'phone': user.phone || ''
            };
        });

        let time = moment(Date.now()).format('YYYYMMDDHHmm');
        let fileName = `issue_${issue.sn}_VotedUsers_${time}.csv`;
        let csv = yield json2csv({ data: data, fields: fields});

        // windows 上面 excel 預設是用 utf-16 開啟，所以這邊要轉碼
        let buf = iconv.encode(csv, 'UTF-16');

        res.header('Content-type', 'text/csv;charset=utf-8;');
        res.header('Content-Disposition', `attachment; filename=${fileName}`);
        return res.end(buf);
    })
    .catch(next);
};
