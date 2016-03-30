
import home from './home';
import auth from './auth';
import login from './login';
import issue from './issue';
import category from './category';

module.exports = function(app) {

    app.use('/', home);
    app.use('/auth', auth);
    app.use('/login', login);
    app.use('/issues', issue);
    app.use('/category', category);

    return function(req, res, next) {
        return next();
    };
};
