
import express from 'express';
import middlewares from './admin/middlewares';
// import apis from './apis';
import controllers from './admin/controllers';
// import admins from './admins';
import errorHandles from './admin/errorHandles';
let app = express();

// middlewares
app.use(middlewares(app));

// controllers
app.use(controllers(app));

// errorHandles
app.use(errorHandles(app));

module.exports = app;
