var Nightmare   = require( 'nightmare' );
var vo          = require( 'vo' );
var errors;

vo( run )( function( err, result )
{
    if ( err )
    {
        throw err;
    }
    else if ( errors !== 0 )
    {
        throw new Error( 'there were more than 0 errors' );
    }
    else
    {
        console.log( 'All tests passed!' );
    }
} );


function *run()
{
    var nightmare   = Nightmare();

    errors       = yield nightmare
        .goto( 'file://' + process.cwd() + '/tests/index.html' )
        .wait( '.pass' )
        .evaluate( function()
        {
            return document.getElementsByClassName( 'fail' ).length;
        } );

    yield nightmare.end();
}