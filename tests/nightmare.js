var Nightmare   = require( 'nightmare' );
var vo          = require( 'vo' );

var connect     = require( 'connect' );
var serveStatic = require( 'serve-static' );
console.log( process.cwd() + '/tests/' );
var server = connect().use( serveStatic( process.cwd() + '/tests/' ) ).listen( 8666);

var errors;

vo( run )( function( err, result )
{
    document.getElementsByClassName( 'pass' ).length;
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
        .goto( 'http://localhost:8666' )
        .wait( '#qunit' )
        .evaluate( function()
        {
            return document.getElementsByClassName( 'fail' ).length;
        } );

    server.close();

    yield nightmare.end();
}
