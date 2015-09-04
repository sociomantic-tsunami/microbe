/* global document, window, µ, $, QUnit, Benchmark, test  */
var indexOf = Array.prototype.indexOf;

module.exports = function( buildTest )
{
    QUnit.module( 'cytoplasm/rootUtils.js' );

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
};

