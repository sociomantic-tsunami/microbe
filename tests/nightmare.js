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

const _cleanArray = function( _r ){ return !!( _r ); };

vo( run )( function( err, result )
{
    tests.server.close();

    if ( tests.failText )
    {
        console.log( tests.failText );
    }

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
    var server      = connect().use( serveStatic( process.cwd() ) ).listen( config.port );

    tests = yield nightmare
        .goto( 'http://localhost:' + config.port + config.path )
        .wait( config.pass )
        .evaluate( function( config )
        {
            var pass        = document.querySelectorAll( config.pass ).length;
            var fail        = document.querySelectorAll( config.fail );
                fail        = Array.prototype.slice.call( fail );
            var failCount   = fail.length;
            var failText;

            if ( failCount )
            {
                failText = fail.map( function( _el )
                {
                    _el = _el.querySelector( '.test-name, .test-message' );

                    if ( _el )
                    {
                        return '[Fail] ' + _el.innerHTML;
                    }
                    else
                    {
                        return null;
                    }
                } );

                failText = failText.join( '\n' );
            }

            return { pass : pass, fail : failCount, failText : failText, config : config };
        }, config );

    tests.server = server;

    yield nightmare.end();
}
