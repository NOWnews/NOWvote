
/*
 * 資料庫資訊
 */
const mongoHost = process.env.NODE_ENV === 'production' ? 'mongodb://127.0.0.1:27017' : 'mongodb://localhost:27017';
const dbName = process.env.NODE_ENV === 'production' ? 'vote_production' : 'vote_staging';

/*
 * redis 資訊
 */
const redisHost = process.env.NODE_ENV === 'production' ? '127.0.0.1' : 'localhost';

/*
 * facebook 資訊
 */
const fbClientID = process.env.NODE_ENV === 'production' ? '985803784832015' : '985803784832015';
const fbClientSecret = process.env.NODE_ENV === 'production' ? '94fd018adb7ea437c3a0a56f41591c58' : '94fd018adb7ea437c3a0a56f41591c58';
const fbCallbackURL = process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:8998/auth/facebook/callback' : 'http://localhost:8998/auth/facebook/callback';

/*
 * google+ 資訊
 */
 const googleClientID = process.env.NODE_ENV === 'production' ? '727890972053-lih4t2kbdj1vt21oa7evfeqfdpqjrn4a.apps.googleusercontent.com' : '727890972053-lih4t2kbdj1vt21oa7evfeqfdpqjrn4a.apps.googleusercontent.com';
 const googleClientSecret = process.env.NODE_ENV === 'production' ? 'haYoLRbQxe91WCFLdme4t-zV' : 'haYoLRbQxe91WCFLdme4t-zV';
 const googleCallbackURL = process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:8998/auth/google/callback' : 'http://localhost:8998/auth/google/callback';

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
    }
};