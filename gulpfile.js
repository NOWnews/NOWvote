var gulp = require('gulp');
var del = require('del');
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

// JS 跟 SCSS 的路徑
var bowerJsPaths = [
    './admin/public/js/*.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/foundation-sites/dist/foundation.js',
];
var bowerScssPaths = [
    './admin/public/scss/admin.scss',
    './bower_components/foundation-sites/assets/foundation.scss',
    './bower_components/font-awesome/scss/font-awesome.scss',
    './bower_components/foundation-datepicker/css/foundation-datepicker.scss'
];

// 移動 font的檔案
gulp.task('moveFontAwesomeFolder', function() {
    return gulp.src('./bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest('./admin/public/dist/fonts'));
});

// 編譯 scss
gulp.task('sass', function() {
    return gulp.src(bowerScssPaths)
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
gulp.task('sass:watch', function() {
    gulp.watch('./admin/public/scss/*.scss', ['sass']);
});

// 編譯 js
gulp.task('script', function() {
    return gulp.src(bowerJsPaths)
        .pipe(plugins.plumber())
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('./admin/public/dist/js'));
});

// 監視 js
gulp.task('script:watch', function() {
    gulp.watch('./admin/public/js/*', ['script']);
});

// 清掉編譯過的檔案
gulp.task('clean', function() {
    del(['admin/public/dist/js/*', 'admin/public/dist/css/*', 'admin/public/dist/fonts/*']);
    return;
});

gulp.task('admin', ['clean', 'moveFontAwesomeFolder','sass', 'script', 'script:watch', 'sass:watch']);
// gulp.task('default', ['clean', 'moveFontAwesomeFolder','sass', 'script', 'script:watch', 'sass:watch']);
