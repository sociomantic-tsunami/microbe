/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'pseudo.js' );


    /**
     * µ contains tests
     *
     * @test    contains exists
     * @test    searches text
     * @test    ignores case
     * @test    ignores false returns
     */
    QUnit.test( ':contains(text)', function( assert )
    {
        assert.ok( µ.pseudo.contains, 'exists' );
        assert.equal( µ( '#example--combined:contains(I am)' ).length, 1, 'searches text' );
        assert.equal( µ( '#example--combined:contains(i am)' ).length, 1, 'ignores case' );
        assert.equal( µ( '#example--combined:contains(moon)' ).length, 0, 'ignores false returns' );

        buildTest(
        'µ( \'#example--combined:contains(I am)\' )', function()
        {
            return µ( '#example--combined:contains(I am)' );
        },

        '$( \'#example--combined:contains(I am)\' )', function()
        {
            return $( '#example--combined:contains(I am)' );
        }, 8 );
    });


    /**
     * µ even tests
     *
     * @test    even exists
     * @test    selects only the even scripts
     * @test    selects the correct half
     */
    QUnit.test( ':even', function( assert )
    {
        var µEvenScripts   = µ( 'script:even' ).length;
        var µScripts       = µ( 'script' ).length;

        assert.ok( µ.pseudo.even, 'exists' );
        assert.equal( µEvenScripts, Math.floor( µScripts / 2 ), 'selects only the even scripts' );
        assert.deepEqual( µScripts[1], µEvenScripts[0], 'selects the correct half' );

        buildTest(
        'µ( \'div:even\' )', function()
        {
            return µ( 'div:even' );
        },

        '$( \'div:even\' )', function()
        {
            return $( 'div:even' );
        }, 9 );
    });


    /**
     * µ first tests
     *
     * @test    first exists
     * @test    finds the right div
     * @test    only returns one div
     */
    QUnit.test( ':first', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µFirstDiv   = µ( 'div:first' );

        assert.ok( µ.pseudo.first, 'exists' );
        assert.deepEqual( µDivs[ 0 ], µFirstDiv[ 0 ], 'finds the right div' );
        assert.equal( µFirstDiv.length, 1, 'only finds one div' );

        buildTest(
        'µ( \'div:first\' )', function()
        {
            return µ( 'div:first' );
        },

        '$( \'div:first\' )', function()
        {
            return $( 'div:first' );
        }, 10 );
    });


    /**
     * µ gt tests
     *
     * @test    gt exists
     * @test    finds the right divs
     * @test    finds the correct number of elements
     */
    QUnit.test( ':gt(X)', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µGtDivs     = µ( 'div:gt(3)' );

        assert.ok( µ.pseudo.gt, 'exists' );
        assert.deepEqual( µDivs[ 6 ], µGtDivs[ 3 ], 'finds the right divs' );
        assert.equal( µGtDivs.length, µDivs.length - 3, 'finds the correct number of elements' );

        buildTest(
        'µ( \'div:gt(3)\' )', function()
        {
            return µ( 'div:gt(3)' );
        },

        '$( \'div:gt(3)\' )', function()
        {
            return $( 'div:gt(3)' );
        }, 11 );
    });


    /**
     * µ has tests
     *
     * @test    has exists
     * @test    finds the correct number of elements
     */
    QUnit.test( ':has(S)', function( assert )
    {
        var µHasDiv = µ( 'div:has(li)' );

        assert.ok( µ.pseudo.has, 'exists' );
        assert.equal( µHasDiv.length, 1, 'grabs the correct amount of elements' );

        buildTest(
        'µ( \'div:has(li)\' )', function()
        {
            return µ( 'div:has(li)' );
        },

        '$( \'div:has(li)\' )', function()
        {
            return $( 'div:has(li)' );
        }, 12 );
    });


    /**
     * µ last tests
     *
     * @test    last exists
     * @test    finds the right div
     * @test    only returns one div
     */
    QUnit.test( ':last', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µLastDiv    = µ( 'div:last' );

        assert.ok( µ.pseudo.last, 'exists' );
        assert.deepEqual( µDivs[ µDivs.length - 1 ], µLastDiv[ 0 ], 'finds the right div' );
        assert.equal( µLastDiv.length, 1, 'only finds one div' );

        buildTest(
        'µ( \'div:last\' )', function()
        {
            return µ( 'div:last' );
        },

        '$( \'div:last\' )', function()
        {
            return $( 'div:last' );
        }, 13 );
    });


    /**
     * µ lt tests
     *
     * @test    lt exists
     * @test    finds the right divs
     * @test    finds the correct number of elements
     */
    QUnit.test( ':lt(X)', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µLtDivs     = µ( 'div:lt(3)' );

        assert.ok( µ.pseudo.lt, 'exists' );
        assert.deepEqual( µDivs[ 1 ], µLtDivs[ 1 ], 'finds the right divs' );
        assert.equal( µLtDivs.length, 3, 'finds the correct number if elements' );

        buildTest(
        'µ( \'div:lt(2)\' )', function()
        {
            return µ( 'div:lt(2)' );
        },

        '$( \'div:lt(2)\' )', function()
        {
            return $( 'div:lt(2)' );
        }, 14 );
    });


    /**
     * µ odd tests
     *
     * @test    odd exists
     * @test    selects only the odd scripts
     * @test    selects the correct half
     */
    QUnit.test( ':odd', function( assert )
    {
        var µOddScripts    = µ( 'script:odd' ).length;
        var µScripts       = µ( 'script' ).length;

        assert.ok( µ.pseudo.odd, 'exists' );
        assert.equal( µOddScripts, Math.ceil( µScripts / 2 ), 'selects only the odd scripts' );
        assert.deepEqual( µScripts[0], µOddScripts[0], 'selects the correct half' );

        buildTest(
        'µ( \'div:odd\' )', function()
        {
            return µ( 'div:odd' );
        },

        '$( \'div:odd\' )', function()
        {
            return $( 'div:odd' );
        }, 15 );
    });


    /**
     * µ root tests
     *
     * @test    root exists
     * @test    selects the root
     */
    QUnit.test( ':root', function( assert )
    {
        var µRoot = µ( 'div:root' );

        assert.ok( µ.pseudo.root, 'exists' );
        assert.deepEqual( µRoot[ 0 ], µ( 'html' )[ 0 ], 'selects the root' );

        buildTest(
        'µ( \'div:root\' )', function()
        {
            return µ( 'div:root' );
        },

        '$( \'div:root\' )', function()
        {
            return $( 'div:root' );
        }, 16 );
    });


    /**
     * µ target tests
     *
     * @test    target exists
     * @test    finds the correct element
     * @test    and only that one
     */
    QUnit.test( ':target', function( assert )
    {
        window.location.hash = 'example--combined';
        var µTarget = µ( 'div:target' );
        var µIdSearch = µ( '#example--combined' );

        assert.ok( µ.pseudo.target, 'exists' );
        assert.deepEqual( µTarget[ 0 ], µIdSearch[ 0 ], 'finds the correct element' );
        assert.equal( µTarget.length, 1, 'and only that one' );

        buildTest(
        'µ( \'div:target\' )', function()
        {
            return µ( 'div:target' );
        },

        '$( \'div:target\' )', function()
        {
            return $( 'div:target' );
        }, 17 );

        window.location.hash = '';
    });
};

