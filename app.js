
import express from 'express';
import middlewares from './server/middlewares';
// import apis from './apis';
import controllers from './server/controllers';
// import admins from './admins';
import errorHandles from './server/errorHandles';
let app = express();

// middlewares
app.use(middlewares(app));

// apis
// app.use(apis(app));

// controllers
app.use(controllers(app));

// admins
// app.use(admins(app));

// errorHandles
app.use(errorHandles(app));

module.exports = app;
