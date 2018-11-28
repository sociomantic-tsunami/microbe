var gulp            = require( 'gulp' );
var fs              = require( 'fs' );
var replace         = require( 'gulp-replace' );
var uglify          = require( 'gulp-uglify' );
var header          = require( 'gulp-header' );
var browserify      = require( 'browserify' );
var Nightmare       = require( 'nightmare' );

var _name           = 'microbe';
var now             = new Date();
var _package        = require( './package.json' );

var licenceLong     = '/*!\n' +
                      ' * Microbe JavaScript Library v' + _package.version + '\n' +
                      ' * ' + _package.homepage + '\n' +
                      ' *\n' +
                      ' * Copyright 2014-' + now.getUTCFullYear() + ' dunnhumby Germany GmbH and other contributors\n' +
                      ' * Released under the MIT license\n' +
                      ' * http://m.icro.be/license\n' +
                      ' *\n' +
                      ' * Date: ' + now.toDateString() + '\n' +
                      ' */\n';

var licenceShort    = '/*! Microbe v' + _package.version + ' | (c) 2014-' + now.getUTCFullYear() + ' dunnhumby Germany GmbH | http://m.icro.be/license */\n';

var token           = 'ThisIsVeryUnlikelyThatAVariableWillBeCalledThisWay';
var exportName      = 'µ';


gulp.task( 'build', function()
{
    browserify( './src/microbe' + _name + '.js', { standalone: token } )
        .bundle()
        .pipe( fs.createWriteStream( __dirname + '/dist/microbe' + _name + '.js' ) )
        .on( 'finish', function()
        {
            gulp.src( './dist/microbe' + _name + '.js' )
                .pipe( replace( token, exportName ) )
                .pipe( header( licenceLong ) )
                .pipe( gulp.dest( './dist/' ) );
        } );
} );


gulp.task( 'buildTests', function()
{
    browserify( './tests/buildTests' + _name + '.js' )
        .bundle()
        .pipe( fs.createWriteStream( __dirname + '/tests/tests' + _name + '.js' ) )
        .on( 'finish', function()
        {
            gulp.src( './tests/tests' + _name + '.js' )
                .pipe( gulp.dest( './tests/' ) );
        } );
});


gulp.task( 'min', function()
{
    browserify( './src/microbe' + _name + '.js', { standalone: token } )
        .bundle()
        .pipe( fs.createWriteStream( __dirname + '/dist/microbe' + _name + '.min.js' ) )
        .on( 'finish', function()
        {
            gulp.src( './dist/microbe' + _name + '.min.js' )
                .pipe( replace( token, exportName ) )
                .pipe( uglify() )
                .pipe( header( licenceShort ) )
                .pipe( gulp.dest( './dist/' ) );
        });
});


gulp.task( 'default', [], function()
{
    _name = '';
    gulp.start( [ 'build', 'min', 'buildTests' ] );
} );


gulp.task( 'microbe', function()
{
    _name = '';
    gulp.start( [ 'build', 'min' ] );
} );


gulp.task( 'selectorEngine', function()
{
    _name = '.selectorEngine';
    gulp.start( [ 'build', 'min', 'buildTests' ] );
} );


gulp.task( 'toolkit', function()
{
    _name = '.toolkit';
    gulp.start( [ 'build', 'min', 'buildTests' ] );
} );


gulp.task( 'http', function()
{
    _name = '.http';
    gulp.start( [ 'build', 'min', 'buildTests' ] );
} );


gulp.task( 'watch', function()
{
    gulp.watch( [ 'src/**/*.js', 'tests/unit/*.js', 'tests/unit/**/*.js' ], [ 'default' ] );
} );
