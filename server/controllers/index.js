
import login from './login';
import auth from './auth';
import home from './home';
import type from './type';

module.exports = function(app) {

    app.use('/', login);
    app.use('/', auth);
    app.use('/', home);
    app.use('/', type);

    return function(req, res, next) {
        return next();
    };
};