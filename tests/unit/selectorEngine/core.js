/* global document, window, µ, $, QUnit, Benchmark, test  */
var indexOf = Array.prototype.indexOf;
var version = '0.4.13';

module.exports = function( buildTest )
{
    QUnit.module( 'selectorEngine/core.js' );

    /**
     * µ children tests
     *
     * @test    children exists
     * @test    children returns an array
     * @test    full of microbes
     * @test    that are correct
     * @test    correctly filters results
     */
    QUnit.test( '.children()', function( assert )
    {
        assert.ok( µ().children, 'exists' );

        var children = µ( '.example--class' ).children();

        assert.ok( Array.isArray( children ), 'returns an array' );
        assert.ok( children[0].type === '[object Microbe]', 'full of microbes' );
        assert.deepEqual( µ( '.example--class' )[0].children[0], children[0][0], 'the correct children' );

        assert.deepEqual( µ( '.example--class' ).children( '#example--id' )[0],
                            µ( '.example--class' ).children()[0].filter( '#example--id' ),
                            'filter strings filter' );

        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.children()', function()
        {
            µDiv.children();
        },

        '$Div for loop', function()
        {
            var res = new Array( $Div.length );
            for ( var i = 0, lenI = $Div.length; i < lenI; i++ )
            {
                res[ i ] = $( $Div[ i ].children );
            }

            return res;
        } );
    });


    /**
     * µ childrenFlat tests
     *
     * @test    childrenFlat exists
     * @test    childrenFlat returns an array
     * @test    with itself removed
     * @test    that are correct
     * @test    correctly filters results
     */
    QUnit.test( '.childrenFlat()', function( assert )
    {
        assert.ok( µ().childrenFlat, 'exists' );

        var childrenFlat = µ( '.example--class' ).childrenFlat();

        assert.ok( childrenFlat.type === '[object Microbe]', 'returns an microbe' );

        var nodeChildren = Array.prototype.slice.call( µ( '.example--class' )[0].children );

        assert.equal( childrenFlat.length, nodeChildren.length, 'correct number of elements' );
        assert.deepEqual( µ( '.example--class' ).childrenFlat( '#example--id' )[0],
                            µ( '.example--class' ).childrenFlat().filter( '#example--id' )[0],
                            'filter strings filter' );

        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.childrenFlat()', function()
        {
            µDiv.childrenFlat();
        },

        '$Div.children()', function()
        {
            $Div.children();
        } );
    });


    /**
     * µ filter tests
     *
     * @test    filter exists
     * @test    selects the correct elements
     * @test    accepts pseudo selectors
     */
    QUnit.test( '.filter()', function( assert )
    {
        assert.ok( µ().filter, 'exists' );
        var µDivs   = µ( 'div' );
        var µId     = µDivs.filter( '#qunit' );

        assert.equal( µId.length, 1, 'selects the correct element' );

        µId         = µDivs.filter( ':lt(3)' );

        assert.equal( µId.length, 3, 'accepts pseudo selectors' );

        µId         = µDivs.filter( function(){ return this.id === 'qunit'; } );

        assert.equal( µId.length, 1, 'accepts functions' );

        var $Divs   = $( 'div' );


        buildTest(
        'µDivs.filter( \'#qunit\' )', function()
        {
            µDivs.filter( 'div.fastest:lt(3):first' );
        },

        '$Divs.filter( \'#qunit\' )', function()
        {
            $Divs.filter( 'div.fastest:lt(3):first' );
        } );
    });


    /**
     * µ find tests
     *
     * @test    find exists
     * @test    selects enough child elements
     * @test    accepts pseudo selectors
     */
    QUnit.test( '.find()', function( assert )
    {
        assert.ok( µ().find, 'exists' );

        var µDiv    = µ( '#qunit' );
        var µH2     = µDiv.find( 'h2' );

        assert.equal( µH2.length, 2, 'selects enough child elements' );

            µH2     = µDiv.find( ':first' );

        assert.equal( µH2.length, 1, 'accepts pseudo selectors' );

        var µADiv = $( '<div>' );
        var µAH1 = µADiv.append( '<h1>' );
        assert.equal( µADiv.find( 'h1' ).length, 1, 'finds unattached elements' );

        var µDivs   = µ( 'div' );
        var $Divs   = $( 'div' );

        buildTest(
        'µDivs.find( \'h2\' )', function()
        {
            µDivs.find( 'h2' );
        },

        '$Divs.find( \'h2\')', function()
        {
            $Divs.find( 'h2' );
        } );
    });


    /**
     * µ first tests
     *
     * @test    first exists
     * @test    returns a microbe
     * @test    of length 1
     * @test    that is the first one
     */
    QUnit.test( '.first()', function( assert )
    {
        assert.ok( µ().first, 'exists' );

        var µEverything = µ( '*' );
        var µFirst = µEverything.first();

        assert.equal( µFirst.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µFirst.length, 1, 'of length 1' );
        assert.deepEqual( µEverything[0], µFirst[0], 'that is actually the first one' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.first()', function()
        {
            µDivs.first();
        },

        '$Divs.first()', function()
        {
            $Divs.first();
        } );
    });


    /**
     * µ last tests
     *
     * @test    last exists
     * @test    returns a microbe
     * @test    of length 1
     * @test    that is the last one
     */
    QUnit.test( '.last()', function( assert )
    {
        assert.ok( µ().last, 'exists' );

        var µEverything = µ( '*' );
        var µLast = µEverything.last();

        assert.equal( µLast.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µLast.length, 1, 'of length 1' );
        assert.deepEqual( µLast[0], µEverything[ µEverything.length - 1 ], 'that is actually the last one' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.last()', function()
        {
            µDivs.last();
        },

        '$Divs.last()', function()
        {
            $Divs.last();
        } );
    });


    /**
     * µ parent tests
     *
     * @test    parent exists
     * @test    returns a microbe
     * @test    of the correct length
     * @test    that is actually the parent(s)
     */
    QUnit.test( '.parent()', function( assert )
    {
        assert.ok( µ().parent, 'exists' );

        var µBody   = µ( 'body' );
        var µParent = µBody.parent();

        assert.equal( µParent.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µParent.length, 1, 'of the correct length' );
        assert.deepEqual( µParent[0], µ( 'html' )[0], 'that is actually the parent(s)' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.parent()', function()
        {
            µDivs.parent();
        },

        '$Divs.parent()', function()
        {
            $Divs.parent();
        } );
    });


    /**
     * µ siblings tests
     *
     * @test    siblings exists
     * @test    siblings returns an array
     * @test    full of microbes
     * @test    with itself removed
     * @test    that are correct
     * @test    correctly filters results
     */
    QUnit.test( '.siblings()', function( assert )
    {
        assert.ok( µ().siblings, 'exists' );

        var siblings = µ( '.example--class' ).siblings();

        assert.ok( Array.isArray( siblings ), 'returns an array' );
        assert.ok( siblings[0].type === '[object Microbe]', 'full of microbes' );

        var nodeChildren = Array.prototype.slice.call( µ( '.example--class' )[0].parentNode.children );

        assert.equal( indexOf.call( siblings[0], µ( '.example--class' )[0] ), -1, 'removed self' );
        assert.equal( siblings[0].length, nodeChildren.length - 1, 'correct number of elements' );

        assert.deepEqual( µ( '.example--class' ).siblings( '#example--id' )[0],
                            µ( '.example--class' ).siblings()[0].filter( '#example--id' ),
                            'filter strings filter' );

        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.siblings()', function()
        {
            µDiv.siblings();
        },

        '$Div for loop', function()
        {
            var res = new Array( $Div.length );
            for ( var i = 0, lenI = $Div.length; i < lenI; i++ )
            {
                res[ i ] = $( $Div[ i ] ).siblings();
            }

            return res;
        } );
    });


    /**
     * µ siblingsFlat tests
     *
     * @test    siblingsFlat exists
     * @test    siblingsFlat returns an array
     * @test    with itself removed
     * @test    that are correct
     * @test    correctly filters results
     */
    QUnit.test( '.siblingsFlat()', function( assert )
    {
        assert.ok( µ().siblingsFlat, 'exists' );

        var siblingsFlat = µ( '.example--class' ).siblingsFlat();

        assert.ok( siblingsFlat.type === '[object Microbe]', 'returns an microbe' );

        var nodeChildren = Array.prototype.slice.call( µ( '.example--class' )[0].parentNode.children );

        assert.equal( indexOf.call( siblingsFlat, µ( '.example--class' )[0] ), -1, 'removed self' );
        assert.equal( siblingsFlat.length, nodeChildren.length - 1, 'correct number of elements' );

        assert.deepEqual( µ( '#qunit-fixture' ).siblingsFlat( '#microbe--example--dom' )[0],
                            µ( '#qunit-fixture' ).siblingsFlat().filter( '#microbe--example--dom' )[0],
                            'filter strings filter' );

        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.siblingsFlat()', function()
        {
            µDiv.siblingsFlat();
        },

        '$Div.siblings()', function()
        {
            $Div.siblings();
        } );
    });



    /**
     * µ toString tests
     *
     * @test    µ().toString exists
     * @test    µ.toString exists
     * @test    microbe is [object Microbe]
     */
    QUnit.test( '.toString()', function( assert )
    {
        assert.ok( µ().toString, 'µ().toString exists' );
        assert.ok( µ.toString, 'exists on root' );
        assert.ok( µ().toString() === '[object Microbe]', 'microbe is [object Microbe]' );

        buildTest(
        'µ.toString', function()
        {
            µ.toString( µ );
            µ.toString( [ 1, 2, 3 ] );
        },

        '$.toString', function()
        {
            $.toString( $ );
            $.toString( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ type test
     *
     * @test    type exists
     */
    QUnit.test( '.type', function( assert )
    {
        var type = '[object Microbe]';

        assert.equal( µ().type, type, 'type is ' + type );

        buildTest( 'No speed tests available for non-functions' );
    });


    /**
     * µ version test
     *
     * @test    version exists
     */
    QUnit.test( '.version', function( assert )
    {
        assert.equal( µ().version, version, 'version is ' + version );

        buildTest( 'No speed tests available for non-functions' );
    });
};

