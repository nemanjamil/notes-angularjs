'use strict';
// https://gist.github.com/atelic/8eb577e87a477a0fb411
var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');

gulp.task('default', function () {
    //console.log('Hello World!');
    gulp.run('styles');
    gulp.watch('assets/sass/*.scss', ['styles']);

});


gulp.task('styles', function(){
    return gulp.src(['assets/sass/**/*.scss','src/css/font.css'])
        .pipe(sass().on('error', sass.logError))
        //.pipe(prefix('last 2 versions'))
        .pipe(concat('main.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('src/css'))
});

