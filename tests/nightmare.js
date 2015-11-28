var Nightmare   = require( 'nightmare' );
var vo          = require( 'vo' );

var connect     = require( 'connect' );
var serveStatic = require( 'serve-static' );

var server      = connect().use( serveStatic( process.cwd() ) ).listen( 8666 );
var tests;

vo( run )( function( err, result )
{
    console.log( 'pass: ' + tests.pass + ', fail: ' + tests.fail );
    if ( err )
    {
        throw err;
    }
    else if ( tests.fail !== 0 )
    {
        throw new Error( '\nthere were more than 0 errors (' + tests.fail + ' to be exact)\n' );
    }
    else
    {
        console.log( 'All tests passed!' );
    }
} );


function *run()
{
    var nightmare   = Nightmare();

    tests = yield nightmare
        .on( 'page-error', function( e ){ console.log( e ); } )
        .on( 'page-log', function( e ){ console.log( e ); } )
        .goto( 'http://localhost:8666/tests/' )
        .wait( '.pass' )
        .evaluate( function()
        {
            var pass = document.getElementsByClassName( 'pass' ).length;
            var fail = document.getElementsByClassName( 'fail' ).length;
            return { pass : pass, fail : fail };
        } );

    server.close();

    yield nightmare.end();
}
