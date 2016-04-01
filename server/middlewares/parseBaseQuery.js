
import is from 'is_js';

module.exports = function() {
    return function(req, res, next) {
        if(req.method === 'GET') {
            let limit = parseInt(req.query.limit, 10);
            let skip = parseInt(req.query.skip, 10);
            req.query.limit = is.nan(limit) ? 12 : Math.max(0, limit);
            req.query.skip = is.nan(skip) ? 0 : Math.max(0, skip);
        }
        return next();
    };
};