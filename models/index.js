
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

module.exports = {
    user: user
};
