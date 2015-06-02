var gulp           = require( 'gulp' );
var browserify     = require( 'browserify' );
var babelify       = require( 'babelify' );
var source         = require( 'vinyl-source-stream' );
var watch          = require( 'gulp-watch' );
var mochaPhantomjs = require( 'gulp-mocha-phantomjs' );


function compile( src, standalone )
{
    var fileSplit = src.split( '/' );
    var file      = fileSplit[fileSplit.length-1];
    var options   =
    {
        debug: true
    };

    standalone && ( options.standalone = standalone );

    var b = browserify( options )
        .transform( babelify )
        .add( src );

    return b.bundle()
        .on( 'error', function( err )
        {
            console.log( err.toString() );
            this.emit( 'end' );
        } )
        .pipe( source( file ) )
        .pipe( gulp.dest( './dist' ) );
}


gulp.task( 'compile', function ()
{
    compile( './src/microbe.js', 'µ' );
} );


gulp.task( 'compile-test', function ()
{
    compile( './tests/unit/buildTests.js' );
} );


gulp.task( 'test', ['compile-test'], function ()
{
    return gulp.src( 'test/index.html', { read: false } )
        .pipe( mochaPhantomjs() );
} );


gulp.task( 'watch', function ()
{
    gulp.start( 'compile' );
    gulp.start( 'compile-test' );

    watch( ['./src/**/*.js'], function()
    {
        gulp.start( 'compile' );
    } );

    watch( ['./test/**/*.js'], function()
    {
        gulp.start( 'compile-test' );
    } );
} );


// Default Task
gulp.task( 'default', ['compile', 'compile-test'] );
