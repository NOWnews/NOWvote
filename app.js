
/*
 * NOWvote Website
 */

import express from 'express';
import middlewares from './server/middlewares';
import controllers from './server/controllers';
import errorHandles from './server/errorHandles';
let app = express();

// middlewares
app.use(middlewares(app));

// controllers
app.use(controllers(app));

// errorHandles
app.use(errorHandles(app));

module.exports = app;
