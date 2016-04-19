
import home from './home';
import auth from './auth';
import user from './user';
import adminUser from './adminUser';
import banner from './banner';
import category from './category';
import issue from './issue';
import ckeditor from './ckeditor';

module.exports = function(app) {

    app.use('/', home);
    app.use('/auth', auth);
    app.use('/user', user);
    app.use('/adminUser', adminUser);
    app.use('/banner', banner);
    app.use('/issue', issue);
    app.use('/category', category);
    app.use('/ckeditor', ckeditor);

    return function(req, res, next) {
        return next();
    };
};
