'use strict';
var gulp = require('gulp');

module.exports = function() {
    return gulp.src(['./src/*.*', './src/assets/**/*.*'])
        .pipe(gulp.dest('./build/'));
};