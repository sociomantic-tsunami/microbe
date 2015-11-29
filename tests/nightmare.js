var Nightmare   = require( 'nightmare' );
var vo          = require( 'vo' );
var connect     = require( 'connect' );
var serveStatic = require( 'serve-static' );

var tests;

const config = {
    port : 8666,
    path : '/tests/',
    pass : '.pass',
    fail : '.fail'
};

vo( run )( function( err, result )
{
    tests.server.close();
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
    var server      = connect().use( serveStatic( process.cwd() ) ).listen( 8666 );

    tests = yield nightmare
        .goto( 'http://localhost:' + config.port + config.path )
        .wait( config.pass )
        .evaluate( function( config )
        {
            var pass = document.querySelectorAll( config.pass ).length;
            var fail = document.querySelectorAll( config.fail ).length;
            return { pass : pass, fail : fail, config : config };
        }, config );

    tests.server = server;

    yield nightmare.end();
}
