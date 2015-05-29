/* global document, window, µ, $, QUnit, Benchmark, buildTest  */
module.exports = function( buildTest )
{
    QUnit.module( 'init.js' );

    QUnit.test( 'wrap an element', function( assert )
    {
        var _body = document.getElementsByTagName( 'body' )[0];
        var µBody = µ( _body );

        assert.equal( µBody.length, 1, 'one body' );
        assert.deepEqual( µBody[ 0 ], _body, 'passes' );

        buildTest(
        'µ( _el )', function()
        {
            return µ( _body );
        },

        '$( _el )', function()
        {
            return $( _body );
        }, 0 );
    });


    QUnit.test( 'query class', function( assert )
    {
        var _div = document.getElementsByClassName( 'example--class' )[0];
        var µDiv = µ( '.example--class' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'.example--class\' )', function()
        {
            return µ( '.example--class' );
        },

        '$( \'.example--class\' )', function()
        {
            return $( '.example--class' );
        }, 1 );
    });


    QUnit.test( 'query id', function( assert )
    {
        var _div = document.getElementById( 'example--id' );
        var µDiv = µ( '#example--id' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'#example--id\' )', function()
        {
            return µ( '#example--id' );
        },

        '$( \'#example--id\' )', function()
        {
            return $( '#example--id' );
        }, 2 );
    });


    QUnit.test( 'query tagname', function( assert )
    {
        var _div = document.getElementsByTagName( 'div' )[0];
        var µDiv = µ( 'div' );

        assert.deepEqual( µDiv[ 0 ].tagName, 'DIV', 'passes' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'div\' )', function()
        {
            return µ( 'div' );
        },

        '$( \'div\' )', function()
        {
            return $( 'div' );
        }, 3 );
    });


    QUnit.test( 'query combined', function( assert )
    {
        var _div = document.querySelector( 'div#example--combined.example--combined' );
        var µDiv = µ( 'div#example--combined.example--combined' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'div#example--combined.example--combined\' )', function()
        {
            return µ( 'div#example--combined.example--combined' );
        },

        '$( \'div#example--combined.example--combined\' )', function()
        {
            return $( 'div#example--combined.example--combined' );
        }, 4 );
    });


    // NON FUNCTIONAL TEST
    // this is a future ability and cannot be tested yet
    //
    // QUnit.test( 'query microbe scope', function( assert )
    // {
    //     var µDiv = µ( 'div', µ( '.example--class--groups' ) );

    //     assert.equal( µDiv.length, 2, 'two divs' );
    // });


    QUnit.test( 'query element scope', function( assert )
    {
        var _scopeEl = µ( '.example--class--groups' )[0];

        var µDiv = µ( 'div', _scopeEl );

        assert.equal( µDiv.length, 2, 'two divs' );
        assert.deepEqual( µDiv.first().parent()[0], _scopeEl, 'correct parent' );

        buildTest(
        'µ( \'div\', _scopeEl )', function()
        {
            return µ( 'div', _scopeEl );
        },

        '$( \'div\', _scopeEl )', function()
        {
            return $( 'div', _scopeEl );
        }, 5 );
    });


    // NON FUNCTIONAL TEST
    // this is a future ability and cannot be tested yet
    //
    // QUnit.test( 'query string scope', function( assert )
    // {
    //     var µDiv = µ( 'div', '.example--class--groups' );

    //     assert.equal( µDiv.length, 2, 'two divs' );
    // });
};
