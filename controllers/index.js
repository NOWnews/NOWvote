
import test from './test';
import qoo from './qoo';

module.exports = function(app) {

    app.use('/test', test);
    app.use('/qoo', qoo);

    return function(req, res, next) {
        return next();
    };
};