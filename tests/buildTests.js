
/* global document, window, µ, $, QUnit, Benchmark  */

/**
 * benchmark tests
 *
 * this function is weird.  it must mix between µ and $ so it can
 * test µ without all modules present
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

    var $Result, $li, $strong;

    var suite = new Benchmark.Suite();

    if ( !_console )
    {
        var µTests  = $( '#qunit-tests' ).first().children();

        var resDiv  = µTests[ this.count ];

        $li      = $( 'li', resDiv );
        $strong  = $( 'strong', resDiv );
        $Result =  $( '<div class="fastest">' );

        resDiv.insertBefore( $Result[ 0 ], $strong[ 0 ] );
    }

    var startTheTest = function( e )
    {
        if ( e )
        {
            // µ( e.target ).text( 'Speed test started...' );
            $( e.target ).text( 'Speed test started...' );
            e.stopPropagation();
            e.preventDefault();
        }

        if ( $Result )
        {
            $Result.off();
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
                    var test = testRes[ i ] = $( '<span class="slow  speed--result">' );
                    $( $li[ i ] ).append( test );
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
                    $Result.html( libraries[ fastest ] + ' is ' + percent + '% faster' );
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

            $Result.html( 'Click to start the speed test' );
            $Result.on( 'click', startTheTest );
        }
        else
        {
            $Result.html( _str1 ).addClass( 'invalid--test' );
        }

        this.count++;
    }
    else
    {
        setupTest();
    }
};


var µ = window.µ = require( '../src/microbe.js' );

require( './unit/selectorEngine/init' )( buildTest );
require( './unit/selectorEngine/pseudo' )( buildTest );
require( './unit/selectorEngine/core' )( buildTest );
require( './unit/selectorEngine/root' )( buildTest );
require( './unit/elements' )( buildTest );
require( './unit/tools' )( buildTest );
require( './unit/http' )( buildTest );
require( './unit/dom' )( buildTest );
require( './unit/events' )( buildTest );
require( './unit/observe' )( buildTest );

document.getElementsByTagName( 'title' )[0].innerHTML = 'µ - ' + µ.version + ' QUnit';

window.buildTest = buildTest;