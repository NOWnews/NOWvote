
import express from 'express';
import middlewares from './middlewares';
import apis from './apis';
import controllers from './controllers';
import admins from './admins';
import errorHandles from './errorHandles';
let app = express();

// middlewares
app.use(middlewares(app));

// apis
app.use(apis(app));

// controllers
app.use(controllers(app));

// admins
app.use(admins(app));

// errorHandles
app.use(errorHandles(app));

module.exports = app;
