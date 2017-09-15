'use strict';
var gulp = require('gulp'),
    patchElement = require('./patch-element');

function copyBowerComponents() {
    return gulp.src(['./bower_components/**/*'], {since: gulp.lastRun(copyBowerComponents)})
        .pipe(patchElement)
        .pipe(gulp.dest('./build/bower_components/'));
}

function copyBowerToSrc() {
    return gulp.src(['./bower_components/**/*'], {since: gulp.lastRun(copyBowerToSrc)})
        .pipe(patchElement)
        .pipe(gulp.dest('./src/bower_components/'));
}

module.exports = function copyBower(toSrc) {
    return toSrc ? copyBowerToSrc : copyBowerComponents;
};