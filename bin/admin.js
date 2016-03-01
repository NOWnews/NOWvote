
require('babel-core/register');
require('babel-polyfill');
require('../global.js');

var colors = require('colors');
var app = require('../admin');
var http = require('http');


var port = process.env.PORT || '8999';
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
console.log(`-------------------------------`.magenta);
console.log(`Start NOWvote admin`.magenta);
console.log(`Listen Port ${port}`.magenta);
console.log(`${NODE_ENV} mode`.magenta);
console.log(`-------------------------------`.magenta);