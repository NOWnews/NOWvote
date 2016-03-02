
import home from './home';
import demo from './demo';

module.exports = function(app) {

    app.use('/', home);
    app.use('/demo', demo);

    return function(req, res, next) {
        return next();
    };
};
