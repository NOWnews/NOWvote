
// Use ES6
// try {
//     require('babel/register')({
//         optional: ['es7.asyncFunctions']
//     });
// }catch (e) {
//     console.log(e);
// }

require('babel-core/register');

var app = require('../app');
var http = require('http');


var port = process.env.PORT || '8998';
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
console.log(`Start Listen Port ${port}`);