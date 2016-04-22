
const login = require('./login');
const auth = require('./auth');
const home = require('./home');
const user = require('./user');
const category = require('./category');
const tag = require('./tag');
const issue = require('./issue');
const vote = require('./vote');
<<<<<<< HEAD
<<<<<<< HEAD
const preview = require('./preview');
=======
const errorpage = require('./errorpage')
>>>>>>> 前端頁面增加404頁面
=======
const errorpage = require('./errorpage')
>>>>>>> 9815d5e3cb53d304e417575d57343304fe23d61f

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
    app.use('/', errorpage)

    return function(req, res, next) {
        return next();
    };
};
