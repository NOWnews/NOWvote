
import Promise from 'bluebird';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

/*
 * 利用 bluebird 將 mongoose 轉換成可以使用 promise
 */
Promise.promisifyAll(mongoose);

const dbUrl = `${config.mongodb}/vote_${NODE_ENV}`;
mongoose.connect(dbUrl);
const connection = mongoose.connection;
console.log(`mongodb connect to: ${dbUrl}`);

autoIncrement.initialize(connection);

/*
 * 因為用 import 會在程式啟動前，就把所有的 code 先做一次，所以這邊只能用 require，要不然 autoIncrement 會出錯
 */
const user = require('./user');
const adminUser = require('./adminUser');
const menuCategory = require('./menuCategory');
const sliderBanner = require('./sliderBanner');
const issue = require('./issue');
const question = require('./question');
const option = require('./option');
const tag = require('./tag');
const issueRelation = require('./issueRelation');
const tagRelation = require('./tagRelation');
const voteCounter = require('./voteCounter');

module.exports = {

    // 一般使用者
    user: user,

    // 後台管理者
    adminUser: adminUser,

    // menu 選單
    menuCategory: menuCategory,

    // slider banner
    sliderBanner: sliderBanner,

    // 投票議題
    issue: issue,

    // 投票議題內的問題
    question: question,

    // 投票議題內問題的選項
    option: option,

    // 投票議題的標籤
    tag: tag,

    // issue, question, options 的關係
    issueRelation: issueRelation,

    tagRelation: tagRelation,

    // 記錄 issue 總共有多少人來投票
    voteCounter: voteCounter
};
