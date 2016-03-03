
import home from './home';
import account from './account';
import carousel from './carousel';
import category from './category';
import content from './content';
import menu from './menu';
import demo from './demo';

module.exports = function(app) {

    app.use('/', home);
    app.use('/account', account);
    app.use('/carousel', carousel);
    app.use('/category', category);
    app.use('/content', content);
    app.use('/menu', menu);
    app.use('/demo', demo);

    return function(req, res, next) {
        return next();
    };
};
