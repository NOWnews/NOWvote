
global._ = require('lodash');
global.NODE_ENV = process.env.NODE_ENV || 'staging';


global.rootPath = __dirname;
global.imageStorage = __dirname + '/imageStorage';
global.config = require('./config');