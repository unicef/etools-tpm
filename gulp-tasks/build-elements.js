'use strict';

var gulp = require('gulp'),
    compileHtmlTags = require('gulp-compile-html-tags'),
    sass = require('gulp-sass'),
    babel = require("gulp-babel"),
    builder = require('polytempl');



module.exports = function (done) {
    gulp.src(['./src/elements/**/*.html'])
        .pipe(builder([process.cwd() + '/src/bower_components/']))
        .pipe(compileHtmlTags('style', function (tag, data) {
            return data.pipe(sass().on('error', function(error) {console.log('\x1b[31m%s\x1b[0m', error.message); done()}))
        }))
        .pipe(compileHtmlTags('script', function (tag, data) {
            return data.pipe(babel({
                presets: ['es2015']
            }).on('error', function(error) {console.log('\x1b[31m%s\x1b[0m', error.message); done()}));
        }))
        .pipe(gulp.dest('./build/elements'))
        .on('end', function() {done();})
};