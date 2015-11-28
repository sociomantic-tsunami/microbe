var Nightmare   = require( 'nightmare' );
var vo          = require( 'vo' );

var connect     = require( 'connect' );
var serveStatic = require( 'serve-static' );

var server = connect().use( serveStatic( process.cwd() ) ).listen( 8666 );

var errors;

vo( run )( function( err, result )
{
    console.log( errors );
    if ( err )
    {
        throw err;
    }
    else if ( errors !== 0 )
    {
        throw new Error( '\nthere were more than 0 errors (' + errors + ' to be exact)\n' );
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
        .on( 'page-error', function( e ){ console.log( e ); } )
        .on( 'page-log', function( e ){ console.log( e ); } )
        .goto( 'http://localhost:8666/tests/' )
        .wait( '.pass' )
        .evaluate( function()
        {
            return document.getElementsByClassName( 'pass' ).length;
        } );

    server.close();

    yield nightmare.end();
}
