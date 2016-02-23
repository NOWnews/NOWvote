
import home from './home';

module.exports = function(app) {

    app.use('/', home);

    return function(req, res, next) {
        return next();
    };
};