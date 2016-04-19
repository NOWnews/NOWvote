
import requestIp from 'request-ip';

const models = require('../../models');

module.exports = function() {

    return function(req, res, next) {

         let userId = req.session.adminUser ? req.session.adminUser._id : null;

         let ip = requestIp.getClientIp(req);

         if(req.method !== 'GET') {
             // 非同步去儲存每個操作
             models.adminLog.createAsync({
                 adminUser: userId,
                 method: req.method,
                 ip: ip,
                 url: req.url,
                 body: req.body
             });
         }

         return next();
    };
};