
import login from './login';
import auth from './auth';
import home from './home';
import category from './category';

module.exports = function(app) {

    app.use('/', login);
    app.use('/', auth);
    app.use('/', home);
    app.use('/', category);

    return function(req, res, next) {
        return next();
    };
};