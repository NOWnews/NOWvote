var gulp = require('gulp');
var del = require('del');
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

// ============================ 這邊是 Admin 的 Gulp =============================================
// JS 跟 SCSS 的路徑
var adminBowerJsPaths = [
    './admin/public/js/*.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/foundation-sites/dist/foundation.js',
    './bower_components/taggingJS/tagging.js',
    './bower_components/foundation-datepicker/js/foundation-datepicker.js',
    './bower_components/foundation-datepicker/js/locales/foundation-datepicker.zh-TW.js',
    './bower_components/html.sortable/dist/html.sortable.js'
];
var adminBowerScssPaths = [
    './admin/public/scss/admin.scss',
    './bower_components/foundation-sites/assets/foundation.scss',
    './bower_components/font-awesome/scss/font-awesome.scss',
    './bower_components/foundation-datepicker/css/foundation-datepicker.scss'
];

// 移動 font的檔案
gulp.task('adminMoveFontAwesomeFolder', function() {
    return gulp.src('./bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest('./admin/public/dist/fonts'));
});

// 編譯 scss
gulp.task('adminSass', function() {
    return gulp.src(adminBowerScssPaths)
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
            outputStyle: 'compressed'
        }))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9']
        }))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('./admin/public/dist/css'));
});

// 監視 scss
gulp.task('adminSass:watch', function() {
    gulp.watch('./admin/public/scss/*.scss', ['adminSass']);
});

// 編譯 js
gulp.task('adminScript', function() {
    return gulp.src(adminBowerJsPaths)
        .pipe(plugins.plumber())
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('./admin/public/dist/js'));
});

// 監視 js
gulp.task('adminScript:watch', function() {
    gulp.watch('./admin/public/js/*', ['adminScript']);
});

// 清掉編譯過的檔案
gulp.task('adminClean', function() {
    del(['admin/public/dist/js/*', 'admin/public/dist/css/*', 'admin/public/dist/fonts/*']);
    return;
});

// ============================ 這邊是 Server 的 Gulp =============================================

// JS 跟 SCSS 的路徑
var serverBowerJsPaths = [
    './server/public/js/*.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/foundation-sites/dist/foundation.js',
    './node_modules/lodash/lodash.js'
];
var serverBowerScssPaths = [
    './server/public/scss/*.scss',
    './bower_components/font-awesome/scss/font-awesome.scss',
    './bower_components/foundation-datepicker/css/foundation-datepicker.scss'
];

var serverSettingsPaths = [
  './bower_components/foundation-sites/scss',
  './bower_components/motion-ui/src'
];

// 移動 font的檔案
gulp.task('serverMoveFontAwesomeFolder', function() {
    return gulp.src('./bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest('./server/public/dist/fonts'));
});

// 編譯 scss
gulp.task('serverSass', function() {
    return gulp.src(serverBowerScssPaths)
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
            includePaths: serverSettingsPaths,
            outputStyle: 'compressed'
        }))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9']
        }))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('./server/public/dist/css'));
});

// 監視 scss
gulp.task('serverSass:watch', function() {
    gulp.watch('./server/public/scss/**/*.scss', ['serverSass']);
});

// 編譯 js
gulp.task('serverScript', function() {
    return gulp.src(serverBowerJsPaths)
        .pipe(plugins.plumber())
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('./server/public/dist/js'));
});

// 監視 js
gulp.task('serverScript:watch', function() {
    gulp.watch('./server/public/js/*', ['serverScript']);
});

// 清掉編譯過的檔案
gulp.task('serverClean', function() {
    del(['server/public/dist/js/*', 'server/public/dist/css/*', 'server/public/dist/fonts/*']);
    return;
});

// ============================ 共同執行端的 Gulp =============================================

// 執行端
gulp.task('default', [
// server
    'serverClean',
    'serverMoveFontAwesomeFolder',
    'serverSass',
    'serverScript',
    'serverScript:watch',
    'serverSass:watch',
// admin
    'adminClean',
    'adminMoveFontAwesomeFolder',
    'adminSass',
    'adminScript',
    'adminScript:watch',
    'adminSass:watch'
]);
