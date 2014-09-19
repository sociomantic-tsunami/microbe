var gulp            = require('gulp');
var fs              = require( 'fs' );
var jshint          = require('gulp-jshint');
var rename          = require('gulp-rename');
var clean           = require('gulp-rimraf');
var concat          = require('gulp-concat');
var notify          = require('gulp-notify');
var traceur         = require('gulp-traceur');
var sourcemaps      = require('gulp-sourcemaps');
var wrapper         = require('gulp-wrapper');
var browserify      = require('gulp-browserify');

var defineAMD = {
    header: '( function ( root, factory )\n' +
            '{\n' +
            '   /* globals define */\n\n' +
            '   /**\n' +
            '    * AMD module\n' +
            '    */\n' +
            '    if ( typeof define === \'function\' && define.amd )\n' +
            '    {\n' +
            '        define( \'microbe\', [], factory );\n' +
            '    }\n' +
            '    else\n' +
            '    {\n' +
            '        root.µ = factory();\n' +
            '    }\n' +
            '}( this, function ()\n' +
            '{\n' +
            '    \'use strict\';\n',

    footer: '    return µ;\n' +
            '\n' +
            '} ) );\n'
};

var fs = require( 'fs' );
var browserify = require('browserify');

// Basic usage
gulp.task('build', function()
{
    browserify('./src/microbe.js', {standalone: 'Microbe'})
        .bundle()
        .pipe(fs.createWriteStream(__dirname + '/dist/microbe.js'));
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
    gulp.start('build');
});

gulp.task('watch', function()
{
    gulp.watch('src/**/*.js', ['build']);
});
