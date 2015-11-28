var Nightmare   = require( 'nightmare' );
var vo          = require( 'vo' );

var connect     = require( 'connect' );
var serveStatic = require( 'serve-static' );

var server = connect().use( serveStatic( process.cwd() ) ).listen( 86666 );

var errors;

vo( run )( function( err, result )
{
    if ( err )
    {
        throw err;
    }
    else if ( errors !== 0 )
    {
        throw new Error( 'there were more than 0 errors (' + errors + ' to be exact)' );
    }
    else
    {
        console.log( 'All tests passed!' );
    }
} );


function *run()
{
    var nightmare   = Nightmare();

    errors = yield nightmare
        .goto( 'http://localhost/tests/index.html' )
        .wait( '.pass' )
        .evaluate( function()
        {
            return document.getElementsByClassName( 'fail' ).length;
        } );
    server.close();

    yield nightmare.end();
}
