/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'cytoplasm/utils.js' );

    /**
     * pseudo custom connectors tests
     *
     * @test    any-link exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( '.contains()', function( assert )
    {
        assert.ok( µ.contains, 'exists' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ matches tests
     *
     * @test    matches exists
     * @test    accepts a microbe
     * @test    accepts an element
     */
    QUnit.test( '.matches()', function( assert )
    {
        var qunit           = document.getElementById( 'qunit' );
        var µMatchesDivs    = µ.matches( µ( 'div' ), '#qunit' );

        assert.ok( µ.matches, 'exists' );
        assert.equal( µMatchesDivs[ 4 ], true, 'finds the right div' );
        assert.equal( µMatchesDivs[ 1 ], false, 'accepts a microbe' );
        assert.equal( µ.matches( qunit, '#qunit' ), true, 'accepts an element' );

        buildTest( 'No comparison available.' );
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

        // buildTest(
        // 'µDivs.filter( \'#qunit\' )', function()
        // {
        //     resetDivs();
        //     µDivs.filter( '#qunit' );
        // },

        // '$Divs.filter( \'#qunit\' )', function()
        // {
        //     resetDivs();
        //     $Divs.filter( '#qunit' );
        // } );

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
     * µ splice tests
     *
     * @test    splice exists
     * @test    is the correct length
     */
    QUnit.test( '.splice()', function( assert )
    {
        assert.ok( µ().splice, 'exists' );
        assert.equal( µ( 'div' ).splice( 0, 5 ).length, 5, 'is the correct length' );

        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.splice( 0, 5 )', function()
        {
            µDiv.splice( 0, 5 );
        },

        '$Div.splice( 0, 5 )', function()
        {
            $Div.splice( 0, 5 );
        } );
    });
};

