
import home from './home';
import auth from './auth';
import login from './login';
import issue from './issue';
import category from './category';

module.exports = function(app) {

    app.use('/', home);
    app.use('/', auth);
    app.use('/', login);
    app.use('/', issue);
    app.use('/', category);

    return function(req, res, next) {
        return next();
    };
};
