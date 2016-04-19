
const models = require('../../models');

module.exports = function(app) {

    // 處理 404 頁面
    app.use(function(req, res, next) {
        res.status(404);
        return res.render('404');
    });

    // 處理底層的錯誤
    app.use(function(err, req, res, next) {

        let errObject = {
            // error:err.code,
            // name: err.name,
            message: err.message,
            stack: err.stack
        };

        console.log('-------------- ERROR --------------');
        console.log(errObject);
        console.log('-------------- ERROR --------------');

        // 記錄 server 錯誤
        models.serviceErrorLog.createAsync({
            method: req.method,
            userId: req.session.user ? req.session.user._id : null,
            url: req.url,
            body: req.body,
            query: req.query,
            params: req.params,
            message: errObject.message,
            stack: errObject.stack
        });

        return res.render('503', { error: errObject });
    });

    return function(req, res, next) {
        return next();
    };
};