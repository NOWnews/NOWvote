
import Promise from 'bluebird';
import mongoose from 'mongoose';

/*
 * 利用 bluebird 將 mongoose 轉換成可以使用 promise 
 */
Promise.promisifyAll(mongoose);

const dbUrl = `${config.mongodb}/vote_${NODE_ENV}`;
mongoose.connect(dbUrl);
console.log(`mongodb connect to: ${dbUrl}`);

module.exports = {

};