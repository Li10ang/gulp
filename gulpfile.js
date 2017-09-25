// 导入需要的模块
var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    minifyCss = require('gulp-minify-css'),
    fileinclude = require('gulp-file-include'),
    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json");

// 编译ts文件
gulp.task("ts", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

// 编译less，其中plumber是防止出错崩溃的插件
gulp.task('less', function() {
    gulp.src('src/less/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

// 编译jade
//gulp.task('jade', function() {
//    gulp.src('src/jade/*.jade')
//        .pipe(plumber())
//        .pipe(jade())
//        .pipe(gulp.dest('public'));
//});

// 编译coffee
//gulp.task('coffee', function() {
//    gulp.src('src/coffee/*.coffee')
//        .pipe(plumber())
//        .pipe(coffee())
//        .pipe(gulp.dest('dist/js'));
//});



// 将所有css文件连接为一个文件并压缩，存到public/css
gulp.task('concatCss', function() {
    gulp.src(['src/css/*.css'])
        .pipe(concat('main.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('public/css'));
});

// search页面的css代码，保存到public/css/search
gulp.task('concatSearchCss', function(){
    gulp.src(['src/css/search/*.css'])
        .pipe(concat('search.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('public/css/search'));
})

// 将所有js文件连接为一个文件并压缩，存到public/js
gulp.task('concatJs', function() {
    gulp.src(['dist/js/*.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

// HTML文件整合
// https://github.com/coderhaoxin/gulp-file-include
gulp.task('html', function(){
    gulp.src('./src/template/*.html')
        .pipe(fileinclude())
        .pipe(gulp.dest('public/html'))
})

// 默认任务
gulp.task('default', ['watch']);


// 监听任务
gulp.task('watch', function() {

    // 建立浏览器自动刷新服务器
    browserSync.init({
        server: {
            baseDir: "public"
        }
    });


    // 预处理
    //gulp.watch('src/jade/**', ['jade']);
    //gulp.watch('src/coffee/**', ['coffee']);
    gulp.watch('src/less/**', ['less'])
    // 合并压缩
    gulp.watch('src/css/*.css', ['concatCss']);
    gulp.watch('src/css/search/*.css', ['concatSearchCss']);
    gulp.watch('src/js/*.js', ['concatJs']);
    // html合并
    gulp.watch('src/template/*.html', ['html']);

    // 自动刷新
    gulp.watch('src/**', function() {
        browserSync.reload();
    });

});

