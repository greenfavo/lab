// Load plugins
var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    //jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');
// Styles任务
gulp.task('styles', function() {
    //编译less
    return gulp.src('public/less/*.less')
    .pipe(less())
    //添加前缀
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //合并
    .pipe(concat('main.css'))
    //保存未压缩文件到我们指定的目录下面
    .pipe(gulp.dest('public/assets/css/'))
    //给文件添加.min后缀
    .pipe(rename({ suffix: '.min' }))
    //压缩样式文件
    .pipe(minifycss())
    //输出压缩文件到指定目录
    .pipe(gulp.dest('public/assets/css/'))
    //提醒任务完成
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts任务
gulp.task('scripts', function() {
    //js代码校验
    return gulp.src('public/js/*.js')
    .pipe(jshint())
    //.pipe(jshint.reporter('default'))
    //js代码合并
    .pipe(concat('main.js'))
    //给文件添加.min后缀
    .pipe(rename({ suffix: '.min' }))
    //压缩脚本文件
    .pipe(uglify())
    //输出压缩文件到指定目录
    .pipe(gulp.dest('assets/js/'))
    //提醒任务完成
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('public/img/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/assets/img/'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Watch
gulp.task('watch', function() {
  // Watch .less files
  gulp.watch('public/less/*.less', ['styles']);
  // Watch .js files
  gulp.watch('public/js/*.js', ['scripts']);
  // Watch image files
  gulp.watch('public/img/*', ['images']);
  // Create LiveReload server
  livereload.listen();
  // Watch any files in assets/, reload on change
  gulp.watch(['public/assets/*']).on('change', livereload.changed);
});

// Default task
gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'images');
});