
global._ = require('lodash');
global.NODE_ENV = process.env.NODE_ENV || 'staging';


global.rootPath = __dirname;
global.config = require('./config');