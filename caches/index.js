
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
    getHeadlineNews: require('./getHeadlineNews'),
    getInstantNews: require('./getInstantNews'),

    // 取得熱門 issues
    getHotIssues: require('./getHotIssues'),

    // 取得美人幫文章
    getBeautyArticle: require('./getBeautyArticle'),
};
