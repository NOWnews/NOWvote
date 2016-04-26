
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

        let issue = yield models.issue.findOne()
            .where('sn').equals(sn)
            .populate('questions')
            .execAsync();

        let relations = yield models.issueRelation.find()
            .where('issue').equals(issue._id)
            .execAsync();

        let userIds = _.map(relations, function(relation) {
            return relation.user + '';
        });

        userIds = _.uniq(userIds);

        let users = yield models.user.find()
            .where('_id').in(userIds)
            .execAsync();

        let fields = ['name', 'email', 'address', 'gender', 'phone'];

        _.forEach(issue.questions, function(question) {
            fields.push(`問題: ${question.content}`);
        });

        debug('fields = %j', fields);

        let data = yield Promise.map(users, function(user) {

            return models.issueRelation.find()
                .where('user').equals(user._id)
                .where('issue').equals(issue._id)
                .populate('option question')
                .execAsync()
                .then(function(relations) {

                    let question = {};
                    _.forEach(relations, function(relation) {
                        debug(relation);
                        question[relation.question.content] = relation.option.content;
                    });

                    return Promise.resolve(question);
                })
                .then(function(question) {

                    debug(question);

                    let data = {
                        'name': user.name,
                        'email': user.email || '',
                        'address': user.address || '',
                        'gender': user.gender || '',
                        'phone': user.phone || '',
                    };

                    _.forIn(question, function(value, key) {
                        data[`問題: ${key}`] = `選擇: ${value}`;
                    });

                    debug(data);

                    return Promise.resolve(data);
                });
        });

        debug('data = %j', data);

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
