
import home from './home';
import account from './account';
import sliderBanner from './sliderBanner';
import category from './category';
import issue from './issue';
import menuCategory from './menuCategory';
import ckeditor from './ckeditor';
import demo from './demo';

module.exports = function(app) {

    app.use('/', home);
    app.use('/account', account);
    app.use('/sliderBanner', sliderBanner);
    app.use('/category', category);
    app.use('/issue', issue);
    app.use('/menuCategory', menuCategory);
    app.use('/ckeditor', ckeditor);
    app.use('/demo', demo);

    return function(req, res, next) {
        return next();
    };
};
