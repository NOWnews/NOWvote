
/*
 * 資料庫資訊
 */
const mongoHost = process.env.NODE_ENV === 'production' ? 'mongodb://192.168.10.16:27017' : 'mongodb://localhost:27017';
const dbName = process.env.NODE_ENV === 'production' ? 'vote_production' : 'vote_staging';

/*
 * redis 資訊
 */
const redisHost = process.env.NODE_ENV === 'production' ? '192.168.10.17' : 'localhost';

/*
 * facebook 資訊
 */
const fbClientID = process.env.NODE_ENV === 'production' ? '804346096332778' : '985803784832015';
const fbClientSecret = process.env.NODE_ENV === 'production' ? 'b68907f44cb1a33f35e2d91300774a6c' : '94fd018adb7ea437c3a0a56f41591c58';
const fbCallbackURL = process.env.NODE_ENV === 'production' ? 'http://vote.nownews.com/auth/facebook/callback' : 'http://localhost:8998/auth/facebook/callback';

/*
 * google+ 資訊
 */
const googleClientID = process.env.NODE_ENV === 'production' ? '77192640596-ljtm6bjf42h120blu0u7uqv0u53p4lq1.apps.googleusercontent.com' : '727890972053-lih4t2kbdj1vt21oa7evfeqfdpqjrn4a.apps.googleusercontent.com';
const googleClientSecret = process.env.NODE_ENV === 'production' ? 'mfS9QJmvBWuzs2BNt4Q4A4U3' : 'haYoLRbQxe91WCFLdme4t-zV';
const googleCallbackURL = process.env.NODE_ENV === 'production' ? 'http://vote.nownews.com/auth/google/callback' : 'http://localhost:8998/auth/google/callback';

/*
 * web url 資訊
 */
const serviceUrl = process.env.NODE_ENV === 'production' ? 'http://vote.nownews.com' : 'http://localhost:8998';
const adminUrl = process.env.NODE_ENV === 'production' ? 'http://admin.vote.nownews.com' : 'http://localhost:8999';

module.exports = {
    /*
     * mongoDB 資料
     */
    mongodb: {
        host: mongoHost,
        dbName: dbName
    },

    /*
     * redis 資料
     */
     redis: {
        host: redisHost,
        expireSeconds: 3600
     },

    /*
     * Facebook Oauth 資料
     */
    facebook: {
        clientID: fbClientID,
        clientSecret: fbClientSecret,
        callbackURL: fbCallbackURL
    },

    /*
     * Google+ Oauth 資料
     */
    google: {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackURL
    },

    /*
     * web url 資訊
     */
    webSite: {
        serviceUrl: serviceUrl,
        adminUrl: adminUrl
    },

    /*
     * v3 api 的端點
     */
    v3api: process.env.NODE_ENV === 'production' ? 'v3.api.nownews.pri:5000' : 'v3.api.nownews.com'

};
