'use strict';
var gulp = require('gulp');

module.exports = function() {
    return gulp.src(['./src/index.html', './src/assets/**/*.*'])
        .pipe(gulp.dest('./build/'));
};