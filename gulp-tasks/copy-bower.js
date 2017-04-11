'use strict';
var gulp = require('gulp');

module.exports = function copyBower() {
    return gulp.src(['./src/bower_components/**/*'])
        .pipe(gulp.dest('./build/bower_components/'));
}