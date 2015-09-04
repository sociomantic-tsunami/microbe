/* global document, window, µ, $, QUnit, Benchmark, buildTest  */
module.exports = function( buildTest )
{
    QUnit.module( 'cytoplasm/cytoplasm.js' );


    /**
     * create a microbe from a css selector
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'create from a css selector', function( assert )
    {
        var µDiv    = µ( '<div>' );
        var µLi     = µ( '<li#id>' );
        var µInput  = µ( '<input.class>' );

        assert.equal( µDiv.length, 1, 'creates a simple div' );
        assert.equal( µLi.length, 1, 'creates a li with id' );
        assert.equal( µInput.length, 1, 'creates an input with class' );

        buildTest( 'No comparison available.' );
    });


    /**
     * create a microbe from html
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'create from html', function( assert )
    {
        var µDiv    = µ( '<div></div>' );
        var µLi     = µ( '<li id="id"></li>' );
        var µInput  = µ( '<input class="class" />' );

        assert.equal( µDiv.length, 1, 'creates a simple div' );
        assert.equal( µLi.length, 1, 'creates a li with id' );
        assert.equal( µInput.length, 1, 'creates an input with class' );

        
        buildTest(
        'µ( \'&lt;li id="id">&lt;/li>\' )', function()
        {
            return µ( '<li id="id"></li>' );
        },

        '$( \'&lt;li id="id">&lt;/li>\' )', function()
        {
            return $( '<li id="id"></li>' );
        } );
    });


    /**
     * µ init wrap element tests
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'make empty sets', function( assert )
    {
        var µBody = µ( [] );

        assert.equal( µBody.length, 0, 'empty set' );
        assert.equal( µBody[ 0 ], undefined, 'successfully fails' );

        µBody = µ();
        assert.equal( µBody.length, 0, 'empty set' );
        assert.equal( µBody[ 0 ], undefined, 'successfully fails' );

        µBody = µ( '' );
        assert.equal( µBody.length, 0, 'empty set' );
        assert.equal( µBody[ 0 ], undefined, 'successfully fails' );

        buildTest(
        'µ( [] )', function()
        {
            return µ( [] );
        },

        '$( [] )', function()
        {
            return $( [] );
        } );
    });


    /**
     * µ init wrap element tests
     *
     * @test    one body
     * @test    passes
     */
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
        } );
    });


    /**
     * µ init wrap element tests
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'wrap an array of elements', function( assert )
    {
        var _body = document.getElementsByTagName( 'body' )[0];
        var µBody = µ( [ _body ] );

        assert.equal( µBody.length, 1, 'one body' );
        assert.deepEqual( µBody[ 0 ], _body, 'passes' );

        var _divs = Array.prototype.slice.call( document.getElementsByTagName( 'div' ) );

        buildTest(
        'µ( _divs )', function()
        {
            return µ( _divs );
        },

        '$( _divs )', function()
        {
            return $( _divs );
        } );
    });


    /**
     * µ init query class tests
     *
     * @test    one div
     * @test    passes
     */
    QUnit.test( 'query class', function( assert )
    {
        var _div = document.getElementsByClassName( 'example--class' )[0];
        var µDiv = µ( '.example--class' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );
        assert.equal( µ( '.exarmple-classssss' ).length, 0, 'successfully fails' );

        buildTest(
        'µ( \'.example--class\' )', function()
        {
            return µ( '.example--class' );
        },

        '$( \'.example--class\' )', function()
        {
            return $( '.example--class' );
        } );
    });


    /**
     * µ init query multiple classes tests
     *
     * @test    one div
     * @test    passes
     */
    QUnit.test( 'query multiple classes', function( assert )
    {
        var _div    = document.getElementsByClassName( 'example--class' );
        var µDiv    = µ( '.example--class.example--class--groups' );
console.log( µDiv );
        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div[0], 'passes' );
        assert.equal( µ( '.exarmple.classssss' ).length, 0, 'successfully fails' );

        buildTest(
        'µ( \'.example--class.example--class--groups\' )', function()
        {
            return µ( '.example--class.example--class--groups' );
        },

        '$( \'.example--class.example--class--groups\' )', function()
        {
            return $( '.example--class.example--class--groups' );
        } );
    });


    /**
     * µ init query id tests
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'query id', function( assert )
    {
        var _div = document.getElementById( 'example--id' );
        var µDiv = µ( '#example--id' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );
        assert.equal( µ( '#exarmple-iddddd' ).length, 0, 'successfully fails' );

        buildTest(
        'µ( \'#example--id\' )', function()
        {
            return µ( '#example--id' );
        },

        '$( \'#example--id\' )', function()
        {
            return $( '#example--id' );
        } );
    });


    /**
     * µ init query id and class tests
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'query id and class', function( assert )
    {
        var _div    = document.getElementById( 'example--combined' );
        var µDiv    = µ( '#example--combined.example--combined' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );
        assert.equal( µ( '#idand.classssss' ).length, 0, 'successfully fails' );

        buildTest(
        'µ( \'#example--combined.example--combined\' )', function()
        {
            return µ( '#example--combined.example--combined' );
        },

        '$( \'#example--combined.example--combined\' )', function()
        {
            return $( '#example--combined.example--combined' );
        } );
    });


    /**
     * µ init query tagname tests
     *
     * @test    correct element
     * @test    passes
     */
    QUnit.test( 'query tagname', function( assert )
    {
        var _div = document.getElementsByTagName( 'div' )[0];
        var µDiv = µ( 'div' );

        assert.equal( µDiv[ 0 ].tagName, 'DIV', 'correct element' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );
        assert.equal( µ( 'exarmple' ).length, 0, 'successfully fails' );

        buildTest(
        'µ( \'div\' )', function()
        {
            return µ( 'div' );
        },

        '$( \'div\' )', function()
        {
            return $( 'div' );
        } );
    });


    /**
     * µ init query combined tests
     *
     * @test    one div
     * @test    passes
     */
    QUnit.test( 'query combined', function( assert )
    {
        var _div = document.querySelector( 'div#example--combined.example--combined' );
        var µDiv = µ( 'div#example--combined.example--combined' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );
        assert.equal( µ( 'example#exarmple.classssss' ).length, 0, 'successfully fails' );

        buildTest(
        'µ( \'div#example--combined.example--combined\' )', function()
        {
            return µ( 'div#example--combined.example--combined' );
        },

        '$( \'div#example--combined.example--combined\' )', function()
        {
            return $( 'div#example--combined.example--combined' );
        } );
    });


    /**
     * µ init query with microbe scope tests
     *
     * @test    two divs
     * @test    correct element
     */
    QUnit.test( 'query with microbe scope', function( assert )
    {
        var µDiv = µ( 'div', µ( '.example--class--groups' ) );
        var $Div = $( 'div', $( '.example--class--groups' ) );

        assert.equal( µDiv.length, 2, 'two divs' );
        assert.equal( µDiv[0].tagName, 'DIV', 'correct element' );
        assert.equal( µ( '.exarmple-classssss', µ( 'exarmple' ) ).length, 0, 'successfully fails scope' );
        assert.equal( µ( '.exarmple-classssss', µ( 'div' ) ).length, 0, 'successfully fails query' );

        buildTest(
        'µ( \'div\', µDiv )', function()
        {
            return µ( 'div', µDiv );
        },

        '$( \'div\', $Div )', function()
        {
            return $( 'div', $Div );
        } );
    });


    /**
     * µ init query with element scope tests
     *
     * @test    two divs
     * @test    correct parent
     */
    QUnit.test( 'query with element scope', function( assert )
    {
        var _scopeEl = µ( '.example--class--groups' )[0];

        var µDiv = µ( 'div', _scopeEl );

        assert.equal( µDiv.length, 2, 'two divs' );
        assert.deepEqual( µDiv[0].parentNode, _scopeEl, 'correct parent' );

        var _el = µ( 'div' )[1];

        buildTest(
        'µ( \'h1\', _el )', function()
        {
            return µ( 'h1', _el );
        },

        '$( \'h1\', _el )', function()
        {
            return $( 'h1', _el );
        } );
    });


    /**
     * µ init query with string scope tests
     *
     * @test    correctly formed selector
     * @test    two divs
     */
    QUnit.test( 'query with string scope', function( assert )
    {
        var µDiv = µ( 'div', '.example--class--groups' );
        assert.equal( µDiv.length, 2, 'two divs from 2 strings' );


        µDiv = µ( µDiv[0], '.example--class--groups' );
        assert.equal( µDiv.length, 1, '1 divs from a string and an element' );
        assert.equal( µ( '.exarmple-classssss', 'exarmple' ).length, 0, 'successfully fails scope' );

        buildTest(
        'µ( \'h1\', \'div\' )', function()
        {
            return µ( 'h1', 'div' );
        },

        '$( \'h1\', \'div\' )', function()
        {
            return $( 'h1', 'div' );
        } );
    });


    /*
     * µ length test
     *
     * @test    length exists
     */
    QUnit.test( '.length', function( assert )
    {
        assert.equal( µ().length, 0, 'length initializes' );
        assert.equal( µ( 'head' ).length, 1, 'length reports correctly' );

        buildTest( 'No speed tests available for non-functions' );
    });
};
