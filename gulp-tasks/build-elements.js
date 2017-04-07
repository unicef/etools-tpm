'use strict';

var gulp = require('gulp'),
    compileHtmlTags = require('gulp-compile-html-tags'),
    sass = require('gulp-sass'),
    babel = require("gulp-babel"),
    builder = require('polytempl'),
    gulpIf = require('gulp-if'),
    combine = require('stream-combiner2').obj,
    through2 = require('through2').obj,
    path = require('path');



module.exports = function (done) {
    gulp.src(['./src/elements/**/*.html', './src/tests/**/*.html'])
        .pipe(builder([process.cwd() + '/src/bower_components/']))
        .pipe(gulpIf(
            function(file) {
                return !~file.path.indexOf('test');
            },
            combine(
                compileHtmlTags('style', function (tag, data) {
                    return data.pipe(sass().on('error', function(error) {console.log('\x1b[31m%s\x1b[0m', error.message); done()}))
                }),
                compileHtmlTags('script', function (tag, data) {
                    return data.pipe(babel({
                        presets: ['es2015']
                    }).on('error', function(error) {console.log('\x1b[31m%s\x1b[0m', error.message); done()}));
                }),
                through2(function(file, enc, callback){
                    file.base = path.normalize(file.base + '..');
                    callback(null, file);
                })
            ),
            through2(function(file, enc, callback){
                file.base = path.normalize(file.base + '..');
                callback(null, file);
            })
        ))
        .pipe(gulp.dest('./build/'))
        .on('end', function() {done();})
};