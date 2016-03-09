
import home from './home';
import account from './account';
import carouselBanner from './carouselBanner';
import category from './category';
import content from './content';
import menuCategory from './menuCategory';
import demo from './demo';

module.exports = function(app) {

    app.use('/', home);
    app.use('/account', account);
    app.use('/carouselBanner', carouselBanner);
    app.use('/category', category);
    app.use('/content', content);
    app.use('/menuCategory', menuCategory);
    app.use('/demo', demo);

    return function(req, res, next) {
        return next();
    };
};
