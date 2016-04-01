
module.exports = {
    client: require('./client'),
    getCategory: require('./getCategory'),
    getBanner: require('./getBanner'),
    getIndexIssues: require('./getIndexIssues'),
    getRedisValue: require('./getRedisValue'),
    setRedisValue: require('./setRedisValue'),
    updateRedisByKey: require('./updateRedisByKey'),

    // 把 api 取得的新聞存到 Redis
    getHotNews: require('./getHotNews'),
    get36News: require('./get36News'),
    getInstantNews: require('./getInstantNews'),
};
