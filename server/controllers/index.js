
const login = require('./login');
const auth = require('./auth');
const home = require('./home');
const category = require('./category');
const tag = require('./tag');
const issue = require('./issue');

module.exports = function(app) {

    app.use('/', login);
    app.use('/', auth);
    app.use('/', home);
    app.use('/', category);
    app.use('/', issue);
    app.use('/', tag);

    return function(req, res, next) {
        return next();
    };
};
