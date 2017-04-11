const gulp = require('gulp');
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');


module.exports = () => {
    return gulp.src('./src/elements/**/*.js', {since: gulp.lastRun('lint')})
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
};