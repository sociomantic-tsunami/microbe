var gulp            = require('gulp');
var fs              = require('fs');
var clean           = require('gulp-rimraf');
var replace         = require('gulp-replace');
var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var header          = require('gulp-header');

var now             = new Date();
var _package        = require( './package.json' );

var liscenceLong    = '/*!\n' +
' * Microbe JavaScript Library v' + _package.version + '\n' +
' * ' + _package.homepage + '\n' +
' *\n' +
' * Copyright 2014-' + now.getUTCFullYear() + ' Sociomantic Labs and other contributors\n' +
' * Released under the MIT license\n' +
' * http://m.icro.be/license\n' +
' *\n' +
' * Date: ' + now.toDateString() + '\n' +
' */\n';

var liscenceShort   = '/*! Microbe v' + _package.version + ' | (c) 2014-' + now.getUTCFullYear() + ' Sociomantic Labs | http://m.icro.be/license */\n';

var browserify      = require('browserify');
var token           = 'ThisIsVeryUnlikelyThatAVariableWillBeCalledThisWay';
var exportName      = 'µ';

// Basic usage
gulp.task('dist', function()
{
    browserify('./src/microbe.js', {standalone: token})
        .bundle()
        .pipe(fs.createWriteStream(__dirname + '/dist/microbe.js'))
        .on( 'finish', function()
        {
            gulp.src('./dist/microbe.js')
                .pipe(replace(token, exportName))
                .pipe(header(liscenceLong))
                .pipe(gulp.dest('./dist/'))
                .pipe(uglify())
                .pipe(rename('./dist/microbe.min.js'))
                .pipe(header(liscenceShort))
                .pipe(gulp.dest('./'));
        });

    browserify('./tests/unit/buildTests.js' )
        .bundle()
        .pipe(fs.createWriteStream(__dirname + '/tests/tests.js'))
        .on( 'finish', function()
        {
            gulp.src('./tests/tests.js')
                .pipe(gulp.dest('./tests/'));
        });
});


gulp.task('build', function()
{
    browserify('./src/microbe.js', {standalone: token})
        .bundle()
        .pipe(fs.createWriteStream(__dirname + '/dist/microbe.js'))
        .on( 'finish', function()
        {
            gulp.src('./dist/microbe.js')
                .pipe(replace(token, exportName))
                .pipe(header(liscenceLong))
                .pipe(gulp.dest('./dist/'));
        });
});


gulp.task('min', function()
{
    browserify('./src/microbe.js', {standalone: token})
        .bundle()
        .pipe(fs.createWriteStream(__dirname + '/dist/microbe.min.js'))
        .on( 'finish', function()
        {
            gulp.src('./dist/microbe.min.js')
                .pipe(replace(token, exportName))
                .pipe(uglify())
                .pipe(header(liscenceShort))
                .pipe(gulp.dest('./dist/'));
        });
});


gulp.task('test', function()
{
    return true;
});


gulp.task('clean', function()
{
    return gulp.src(['dist/'], {read: false}).pipe(clean());
});


gulp.task('default', [], function()
{
    gulp.start('dist');
});


gulp.task('watch', function()
{
    gulp.watch('src/**/*.js', ['build']);
});