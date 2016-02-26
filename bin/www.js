
// Use ES6
// try {
//     require('babel/register')({
//         optional: ['es7.asyncFunctions']
//     });
// }catch (e) {
//     console.log(e);
// }

require('babel-core/register');
require('babel-polyfill');
require('../global.js');

var colors = require('colors');
var app = require('../app');
var http = require('http');


var port = process.env.PORT || '8998';
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
console.log('-------------------------------'.cyan);
console.log('Start NOWvote website'.cyan);
console.log(`Listen Port ${port}`.cyan);
console.log(`${NODE_ENV} mode`.cyan);
console.log('-------------------------------'.cyan);
// console.log(`Start NOWvote website and Listen Port ${port} and ${NODE_ENV} mode`);
// console.log(`Start Listen Port ${port} and ${NODE_ENV} mode`);