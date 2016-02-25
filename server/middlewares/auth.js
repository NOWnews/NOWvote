
import passport from 'passport';
import models from '../../models';
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(app) {

    // passport 初始化
    app.use(passport.initialize());
    // passport 使用 session，所以你一定要裝 session 的 module
    app.use(passport.session());

    app.get('/auth/facebook',
        passport.authenticate('facebook')
    );

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            // session: false,
            failureRedirect: '/auth/fail/'
        }),
        function(req, res) {
            res.redirect('/auth/success/');
    });

    passport.use(new FacebookStrategy({
            clientID: '517019041740993',
            clientSecret: '6319c6aa52b8c1919cb41eee08634917',
            callbackURL: 'http://localhost:3000/auth/facebook/callback'
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

    // 當 FacebookStrategy 認證成功，就會把資料傳到這邊，並且存在 session
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

        return next();
    };
};