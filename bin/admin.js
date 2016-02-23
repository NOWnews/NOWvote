
require('babel-core/register');
require('babel-polyfill');
require('../global.js');

var app = require('../admin');
var http = require('http');


var port = process.env.PORT || '8999';
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
console.log('-------------------------------');
console.log('Start NOWvote admin');
console.log(`Listen Port ${port}`);
console.log(`${NODE_ENV} mode`);
console.log('-------------------------------');