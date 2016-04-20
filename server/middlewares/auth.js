
import passport from 'passport';

const debug = require('debug')('NOWvote:server:middlewares:auth');
const models = require('../../models');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {

    // passport 初始化
    app.use(passport.initialize());
    // passport 使用 session，所以你一定要裝 session 的 module
    app.use(passport.session());

    app.get('/auth/facebook',
        function(req, res, next){
            // 這邊可以把要導回的路徑記錄起來
            let returnTo = req.query.returnTo || '/';
            req.session.returnTo = returnTo;
            return next();
        },
        passport.authenticate('facebook', {
            scope: [
                'public_profile'
            ]
        })
    );

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            // session: false,
            failureRedirect: '/auth/fail/'
        }),
        function(req, res) {
            res.redirect(req.session.returnTo);
        }
    );

    app.get('/auth/google',
        function(req, res, next){
            // 這邊可以把要導回的路徑記錄起來
            let returnTo = req.query.returnTo || '/';
            console.log(returnTo);
            req.session.returnTo = returnTo;
            return next();
        },
        passport.authenticate('google', {
            scope: [
                'https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/plus.profile.emails.read'
            ]
        }
    ));

    app.get( '/auth/google/callback',
        passport.authenticate( 'google', {
            // successRedirect: '/auth/success',
            failureRedirect: '/auth/fail/'
        }),function(req, res, next) {
            res.redirect(req.session.returnTo);
        }
    );

    app.post('/localLogin',
        passport.authenticate('local', {
            // successRedirect: '/bbbb',
            failureRedirect: '/login',
            // failureFlash: true
        }),function(req, res, next) {
            // 這邊可以把要導回的路徑記錄起來
            let returnTo = req.query.returnTo || '/';
            req.session.returnTo = returnTo;
            res.redirect(req.session.returnTo);
        }
    );

    passport.use(new FacebookStrategy({
            clientID: '985803784832015',
            clientSecret: '94fd018adb7ea437c3a0a56f41591c58',
            callbackURL: 'http://localhost:8998/auth/facebook/callback'
        },
        async function(accessToken, refreshToken, profile, done) {

            let aliveUser = await models.user.findOne()
                .where('oauthType').equals('FACEBOOK')
                .where('oauthId').equals(profile.id)
                .execAsync();

            if(aliveUser) {
                return done(null, aliveUser);
            }

            let newUser = await models.user.createAsync({
                name: profile.username || profile.displayName || profile._json.name,
                nickname: profile.displayName || profile.username || profile._json.name,
                oauthType: 'FACEBOOK',
                oauthId: profile.id
            });

            return done(null, newUser);
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: '727890972053-lih4t2kbdj1vt21oa7evfeqfdpqjrn4a.apps.googleusercontent.com',
            clientSecret: 'haYoLRbQxe91WCFLdme4t-zV',
            callbackURL: 'http://localhost:8998/auth/google/callback',
            passReqToCallback: true
        },
        async function(request, accessToken, refreshToken, profile, done) {

            let aliveUser = await models.user.findOne()
                .where('oauthType').equals('GOOGLE')
                .where('oauthId').equals(profile.id)
                .execAsync();

            if(aliveUser) {
                return done(null, aliveUser);
            }

            let newUser = await models.user.createAsync({
                name: profile.displayName || '',
                nickname: profile.displayName || '',
                email: profile.email || '',
                oauthType: 'GOOGLE',
                oauthId: profile.id
            });

            return done(null, newUser);
        }
    ));

    passport.use(new LocalStrategy({
            // passport 會自動去找 form 裡面的 username，所以要改成用 email
            usernameField: 'email'
        },
        async function(username, password, done) {

            let email = username;

            let aliveUser = await models.user.findOne()
                .where('email').equals(email)
                .where('password').equals(password)
                .where('trashed').equals(false)
                .execAsync();

            if(!aliveUser) {
                return done(null, false, {
                    message: '找不到使用者'
                });
            }

            return done(null, aliveUser);
        }
    ));

    // 當 Strategy 認證成功，就會把資料傳到這邊，並且存在 session
    passport.serializeUser(function(user, done) {
        return done(null, user);
    });

    // 每次都會檢查 session 有沒有資料
    passport.deserializeUser(function(user, done) {
        return done(null, user);
    });

    return function(req, res, next) {

        // 因為原本預設儲存的位置在在 req.session.passport.user 太醜了，改成存在 req.sesion.user
        if(req.session && req.session.passport && req.session.passport.user) {
            req.session.user = req.session.passport.user;
            delete req.session.passport;
        }

        // 將 session.user 放到 locals.user 裡，讓 site 可以取得資料
        res.locals.user = req.session.user;

        return next();
    };
};
