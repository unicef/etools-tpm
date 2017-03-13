'use strict';
var gulp = require('gulp');

module.exports = function() {
    return gulp.src(['./src/bower_components/**/*'])
        .pipe(gulp.dest('./build/bower_components/'));
}