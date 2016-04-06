
const login = require('./login');
const auth = require('./auth');
const home = require('./home');
const category = require('./category');
const tag = require('./tag');
const issue = require('./issue');
const vote = require('./vote');

module.exports = function(app) {

    app.use('/', home);
    app.use('/', auth);
    app.use('/', login);
    app.use('/', category);
    app.use('/', issue);
    app.use('/', tag);
    app.use('/', vote);

    return function(req, res, next) {
        return next();
    };
};
