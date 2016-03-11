
import home from './home';
import account from './account';
import sliderBanner from './sliderBanner';
import category from './category';
import content from './content';
import menuCategory from './menuCategory';
import demo from './demo';

module.exports = function(app) {

    app.use('/', home);
    app.use('/account', account);
    app.use('/sliderBanner', sliderBanner);
    app.use('/category', category);
    app.use('/content', content);
    app.use('/menuCategory', menuCategory);
    app.use('/demo', demo);

    return function(req, res, next) {
        return next();
    };
};
