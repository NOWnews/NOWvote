import express from 'express';
let app = express();

// middlewares
let middlewares = require('./middlewares');
app.use(middlewares(app));

// apis
let apis = require('./apis');
app.use(apis(app));

// controllers
let controllers = require('./controllers');
app.use(controllers(app));

// admins
let admins = require('./admins');
app.use(admins(app));

// errorHandles
let errorHandles = require('./errorHandles');
app.use(errorHandles(app));

module.exports = app;
