
const login = require('./login');
const auth = require('./auth');
const sitemap = require('./sitemap');
const home = require('./home');
const user = require('./user');
const category = require('./category');
const tag = require('./tag');
const issue = require('./issue');
const vote = require('./vote');
const preview = require('./preview');
const errorpage = require('./errorpage');
const files = require('./files');

module.exports = function(app) {

    app.use('/', home);
    app.use('/', auth);
    app.use('/', login);
    app.use('/', user);
    app.use('/', category);
    app.use('/', issue);
    app.use('/', tag);
    app.use('/', vote);
    app.use('/', preview);
    app.use('/', errorpage);
    app.use('/', sitemap);
    app.use('/', files);

    return function(req, res, next) {
        return next();
    };
};
