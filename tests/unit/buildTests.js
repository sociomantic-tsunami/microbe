
/* global document, window, µ, $, QUnit, Benchmark  */

/**
 * benchmark tests
 *
 * @param  {str}                    _str1               test 1 name
 * @param  {func}                   _cb1                test 1
 * @param  {str}                    _str2               test 2 name
 * @param  {func}                   _cb2                test 2
 * @param  {int}                    testNum             test number
 *
 * @return {void}
 */
var buildTest = function( _str1, _cb1, _str2, _cb2, testNum )
{
    if ( typeof _cb1 !== 'function' )
    {
        testNum = _cb1;
    }

    var µTests  = µ( '#qunit-tests' ).children()[0];

    var resDiv  = µTests[ testNum ];

    var µLi      = µ( 'li', resDiv );
    var µStrong  = µ( 'strong', resDiv );
    var µResult =  µ( '<div.fastest>' );

    resDiv.insertBefore( µResult[ 0 ], µStrong[ 0 ] );

    if ( typeof _cb1 === 'function' )
    {
        var testRes = [];
        var _arr    = [];
        var i       = 0;
        var libraries = [ 'µ', '$' ];
        var suite = new Benchmark.Suite();

        suite.add( _str1, _cb1 )
            .add( _str2, _cb2 )
            .on( 'cycle', function( event )
            {
                _arr.push( this[ i ].hz );
                var test = testRes[ i ] = µ( '<span.speed--result.slow>' );
                µ( µLi[ i ] ).append( test );
                test.html( String( event.target ) );

                i++;
            } )
            .on( 'complete', function()
            {
                var fastest = _arr.indexOf( Math.max.apply( Math, _arr ) );
                testRes[ fastest ].removeClass( 'slow' );

                µResult.html( libraries[ fastest ] + ' is the fastest' );
            } );

        var startTheTest = function( e )
        {
            e.stopPropagation();
            e.preventDefault();
            µResult.off();
            setTimeout( function()
            {
                suite.run( { 'async': true } );
            }, 1 );
        };

        µResult.html( 'Click to start the speed test' );
        µResult.on( 'click', startTheTest );
    }
    else
    {
        µResult.html( _str1 ).addClass( 'invalid--test' );
    }
};

require( './init' )( buildTest );
require( './pseudo' )( buildTest );
require( './core' )( buildTest );
require( './dom' )( buildTest );
require( './events' )( buildTest );
require( './observe' )( buildTest );