/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'pseudo.js' );


    /**
     * µ any-link tests
     *
     * @test    any-link exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':any-link', function( assert )
    {
        assert.ok( µ.pseudo[ 'any-link' ], 'exists' );
        assert.equal( µ( ':any-link' ).length, document.getElementsByTagName( 'A' ).length, 'gets links' );
        assert.equal( µ( 'div ~ *:any-link' ).length, document.querySelectorAll( 'div ~ a' ).length, 'gets scoped links' );

        buildTest(
        'µ( \'.fastest:any-link\' )', function()
        {
            return µ( '.fastest:any-link' );
        },

        '$( \'.fastest:link\' )', function()
        {
            return $( '.fastest:link' );
        } );
    });


    /**
     * ### blank
     * 
     * µ blank tests
     *
     * @test    blank exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':blank', function( assert )
    {
        assert.ok( µ.pseudo.blank, 'exists' );

        assert.equal( µ( ':blank' ).length, 4, 'gets blanks' );
        assert.equal( µ( 'div *:blank' ).length, 4, 'gets scoped blanks' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### column
     * 
     * µ column selector tests
     *
     * @test    blank exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':column', function( assert )
    {
        assert.ok( µ.pseudo.column, 'exists' );

        var col1 = document.getElementById( 'col1' );
        assert.equal( µ( '#col1:column' )[0], col1, 'as pseudo' );
        assert.equal( µ( ':column(#col1)' )[0], col1, 'filter with variable' );

        buildTest( 'No comparison available.' );
    });



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
        } );
    });


    /**
     * µ default tests
     *
     * @test    default exists
     * @test    selects only the default inputs
     * @test    selects only the default inputs from a scoped selector
     */
    QUnit.test( ':default', function( assert )
    {
        var µDefaults       = µ( ':default' );
        var µScopedDefaults = µ( 'div *:default' );

        assert.ok( µ.pseudo.even, 'exists' );
        assert.deepEqual( µDefaults.length, 2, 'selects the default inputs' );
        assert.deepEqual( µScopedDefaults.length, 2, 'selects the default inputs scoped' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ default tests
     *
     * @test    dir exists
     * @test    selects ltr
     * @test    selects rtl
     */
    QUnit.test( ':dir', function( assert )
    {
        var µLTR    = µ( 'div:dir(ltr)' );
        var µRTL    = µ( 'div:dir(rtl)' );

        assert.ok( µ.pseudo.dir, 'exists' );
        assert.deepEqual( µLTR.length, µ( 'div' ).length, 'selects ltr' );
        assert.equal( µRTL.length, 0, 'selects rtl' );

        buildTest( 'No comparison available.' );
    });



    /**
     * µ drop tests
     *
     * @test    default exists
     * @test    selects only the default inputs
     * @test    selects only the default inputs from a scoped selector
     */
    QUnit.test( ':drop', function( assert )
    {
        var µDrop    = µ( 'div:drop' );

        assert.ok( µ.pseudo.drop, 'exists' );
        assert.equal( µDrop.length, 1, 'selects dropzone' );

        buildTest( 'No comparison available.' );
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
        } );
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
        } );
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
        } );
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
        } );
    });


    /**
     * µ in-range tests
     *
     * @test    in-range exists
     * @test    finds the correct number of elements
     * @test    finds the correct element
     */
    QUnit.test( ':in-range', function( assert )
    {
        var µInRangeDiv = µ( ':in-range' );
        var byElement   = µ( '#emailInput2' )[0]; 

        assert.ok( µ.pseudo[ 'in-range' ], 'exists' );
        assert.equal( µInRangeDiv.length, 1, 'grabs the correct amount of elements' );
        assert.deepEqual( µInRangeDiv[0], byElement, 'grabs the correct element' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ lang tests
     *
     * @test    lang exists
     * @test    finds the right div
     * @test    only returns one div
     */
    QUnit.test( ':lang', function( assert )
    {
        var µlangDiv        = µ( 'div:lang(gb-en)' );
        var µWildcardDiv    = µ( 'div:lang(*-en)' );

        assert.ok( µ.pseudo.lang, 'exists' );
        assert.equal( µlangDiv.length, 1, 'finds a specified language' );
        assert.equal( µWildcardDiv.length, 2, 'finds a wildcard language' );

        // this is css2 spec and it works. µ is slower, but $ cant do *
        // buildTest(
        // 'µ( \':lang(gb-en)\' )', function()
        // {
        //     return µ( ':lang(gb-en)' );
        // },

        // '$( \':lang(gb-en)\' )', function()
        // {
        //     return $( ':lang(gb-en)' );
        // } );

        buildTest( 'No comparison available.' );
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
        } );
    });


    /**
     * µ local-link tests
     *
     * @test    local-link exists
     * @test    finds the right div
     * @test    only returns one div
     */
    QUnit.test( ':local-link', function( assert )
    {
        var µLinks      = µ( ':local-link' );
        var allLinks    = µ( 'a' ); 
        var µDepth1     = µ( ':local-link(1)' );
        var µDepth2     = µ( ':local-link(2)' );

        assert.ok( µ.pseudo[ 'local-link'], 'exists' );
        assert.equal( µLinks.length, allLinks.length, 'get links' );
        assert.equal( µDepth1.length, 0, 'correctly specifies depth' );
        assert.equal( µDepth2.length, allLinks.length, 'correctly specifies depth' );

        buildTest( 'No comparison available.' );
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
        assert.equal( µLtDivs.length, 3, 'finds the correct number of elements' );

        buildTest(
        'µ( \'div:lt(2)\' )', function()
        {
            return µ( 'div:lt(2)' );
        },

        '$( \'div:lt(2)\' )', function()
        {
            return $( 'div:lt(2)' );
        } );
    });


    /**
     * µ matches tests
     *
     * @test    matches exists
     * @test    finds the right div
     * @test    works with pseudoselectors
     */
    QUnit.test( ':matches', function( assert )
    {
        var qunit           = document.getElementById( 'qunit' );
        var µMatchesDivs    = µ( 'div:matches(#qunit)' );

        assert.ok( µ.pseudo.matches, 'exists' );
        assert.deepEqual( µMatchesDivs[ 0 ], qunit, 'finds the right div' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### not
     * 
     * µ complex not selector tests
     *
     * @test    blank exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':not', function( assert )
    {
        assert.ok( µ.pseudo.not, 'exists' );

        var col2 = document.getElementById( 'col2' );
        assert.equal( µ( 'col:not(#col2)' ).indexOf( col2 ), -1, 'filter with single selector' );
        assert.equal( µ( 'col:not(#col2,#col3)' ).indexOf( col2 ), -1, 'filter with multiple selectors' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### nth-column
     * 
     * µ column selector tests
     *
     * @test    nth-column exists
     * @test    filter with number
     * @test    filter with n-number
     */
    QUnit.test( ':nth-column', function( assert )
    {
        assert.ok( µ.pseudo[ 'nth-column' ], 'exists' );

        var col2 = document.getElementById( 'col2' );
        assert.equal( µ( ':nth-column(2)' )[0], col2, 'filter with number' );
        assert.equal( µ( ':nth-column(2n1)' )[0], col2, 'filter with n-number' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### nth-last-column
     * 
     * µ column selector tests
     *
     * @test    blank exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':nth-last-column', function( assert )
    {
        assert.ok( µ.pseudo[ 'nth-last-column' ], 'exists' );
    
        var col1 = document.getElementById( 'col1' );
        assert.equal( µ( ':nth-last-column(3)' )[0], col1, 'filter with number' );
        assert.equal( µ( ':nth-last-column(2n1)' )[0], col1, 'filter with n-number' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### nth-last-match
     * 
     * µ match selector tests
     *
     * @test    blank exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':nth-last-match', function( assert )
    {
        assert.ok( µ.pseudo[ 'nth-last-match' ], 'exists' );
    
        var col1 = document.getElementById( 'col1' );
        assert.equal( µ( 'col:nth-last-match(3)' )[0], col1, 'filter with number' );
        assert.equal( µ( 'col:nth-last-match(2n1)' )[0], col1, 'filter with n-number' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### nth-match
     * 
     * µ match selector tests
     *
     * @test    nth-match exists
     * @test    filter with number
     * @test    filter with n-number
     */
    QUnit.test( ':nth-match', function( assert )
    {
        assert.ok( µ.pseudo[ 'nth-match' ], 'exists' );

        var col2 = document.getElementById( 'col2' );
        assert.equal( µ( 'col:nth-match(2)' )[0], col2, 'filter with number' );
        assert.equal( µ( 'col:nth-match(2n1)' )[0], col2, 'filter with n-number' );

        buildTest( 'No comparison available.' );
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
        } );
    });


    /**
     * µ out-of-range tests
     *
     * @test    out-of-range exists
     * @test    finds the correct number of elements
     * @test    finds the correct element
     */
    QUnit.test( ':out-of-range', function( assert )
    {
        var µInRangeDiv = µ( ':out-of-range' );
        var byElement   = µ( '#emailInput3' )[0]; 

        assert.ok( µ.pseudo[ 'out-of-range' ], 'exists' );
        assert.equal( µInRangeDiv.length, 1, 'grabs the correct amount of elements' );
        assert.deepEqual( µInRangeDiv[0], byElement, 'grabs the correct element' );

        buildTest( 'No comparison available.' );
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
        } );
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
        } );

        window.location.hash = '';
    });
};

