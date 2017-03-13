'use strict';

var gulp = require('gulp'),
    compileHtmlTags = require('gulp-compile-html-tags'),
    sass = require('gulp-sass'),
    babel = require("gulp-babel"),
    builder = require('polytempl');



module.exports = function () {
    return gulp.src(['./src/elements/**/*.html'])
        .pipe(builder([process.cwd() + '/src/bower_components/']))
        .pipe(compileHtmlTags('style', function (tag, data) {
            return data.pipe(sass())
        }))
        .pipe(compileHtmlTags('script', function (tag, data) {
            return data.pipe(babel());
        }))
        .pipe(gulp.dest('./build/elements'))
};