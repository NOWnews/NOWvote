
import Promise from 'bluebird';
import co from 'co';
import moment from 'moment-timezone';

const debug = require('debug')('NOWvote:admin:controllers:issue:action.exportUser');
const json2csv = Promise.promisify(require('json2csv'));
const models = require('../../../models');

module.exports = function(req, res, next) {

    let sn = parseInt(req.params.sn, 10);
    co(function*() {

        let issue = yield models.issue.findBySn(sn);
        // debug('issue = %j', issue);

        let relations = yield models.issueRelation.find()
            .where('issue').equals(issue._id)
            .populate('user')
            .execAsync();
        // debug('relations = %j', relations);

        let users = _.map(relations, function(relation) {
            return relation.user;
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

        res.header('Content-disposition', `attachment; filename=${fileName}`);
        res.header('Content-type', 'text/csv;  charset=utf-8;');
        return res.end(csv);
    })
    .catch(next);
};