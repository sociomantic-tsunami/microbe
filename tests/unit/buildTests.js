
/* global document, window, µ, $, QUnit, Benchmark  */

/**
 * benchmark tests
 *
 * @param  {str}                    _str1               test 1 name
 * @param  {func}                   _cb1                test 1
 * @param  {str}                    _str2               test 2 name
 * @param  {func}                   _cb2                test 2
 *
 * @return {void}
 */
var buildTest = function( _str1, _cb1, _str2, _cb2, _console )
{
    this.count = this.count || 0;

    var µResult, µLi, µStrong;

    var suite = new Benchmark.Suite();

    if ( !_console )
    {
        var µTests  = µ( '#qunit-tests' ).children()[0];

        var resDiv  = µTests[ this.count ];

        µLi      = µ( 'li', resDiv );
        µStrong  = µ( 'strong', resDiv );
        µResult =  µ( '<div.fastest>' );

        resDiv.insertBefore( µResult[ 0 ], µStrong[ 0 ] );
    }

    var startTheTest = function( e )
    {
        if ( e )
        {
            µ( e.target ).text( 'Speed test started...' );
            e.stopPropagation();
            e.preventDefault();
        }

        if ( µResult )
        {
            µResult.off();
        }

        setTimeout( function()
        {
            suite.run( { 'async': true } );
        }, 1 );
    };

    var setupTest = function()
    {
        var testRes = [];
        var _arr    = [];
        var i       = 0;
        var libraries = [ 'µ', '$' ];

        suite.add( _str1, _cb1 )
            .add( _str2, _cb2 )
            .on( 'cycle', function( event )
            {
                _arr.push( this[ i ].hz );

                if ( !_console )
                {
                    var test = testRes[ i ] = µ( '<span.speed--result.slow>' );
                    µ( µLi[ i ] ).append( test );
                    test.html( String( event.target ) );
                }

                i++;
            } )
            .on( 'complete', function()
            {
                var fastest = _arr.indexOf( Math.max.apply( Math, _arr ) );
                var slowest = fastest === 1 ? 0 : 1;
                var percent = ( _arr[ fastest ] /  _arr[ slowest ] * 100 - 100 ).toFixed( 2 );

                if ( !_console )
                {
                    testRes[ fastest ].removeClass( 'slow' );
                    µResult.html( libraries[ fastest ] + ' is ' + percent + '% faster' );
                }
                else
                {
                    console.log( 'function ' + ( fastest + 1 ) + ' is ' + percent + '% faster' );
                    console.log( {
                        raw: _arr,
                        func1: _cb1,
                        func2: _cb2
                    } );
                }
            } );

            if ( _console === true )
            {
                console.log( 'test started' );
                startTheTest();
            }
    };

    if ( !_console )
    {
        if ( typeof _cb1 === 'function' )
        {
            setupTest();

            µResult.html( 'Click to start the speed test' );
            µResult.on( 'click', startTheTest );
        }
        else
        {
            µResult.html( _str1 ).addClass( 'invalid--test' );
        }

        this.count++;
    }
    else
    {
        setupTest();
    }
};

require( './pristella' )( buildTest );
require( './pseudo' )( buildTest );
require( './core' )( buildTest );
require( './root' )( buildTest );
require( './http' )( buildTest );
require( './dom' )( buildTest );
require( './events' )( buildTest );
require( './observe' )( buildTest );

window.buildTest = buildTest;