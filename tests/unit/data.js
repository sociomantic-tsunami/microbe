/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'data.js' );


    /**
     * µ get tests
     *
     * @test    get exists
     * @test    get gets
     */
    QUnit.test( '.get', function( assert )
    {
        assert.ok( µ().get, 'exists' );

        var µExamples   = µ( '.example--class' );

        µExamples[0].data = µExamples[0].data || {};
        µExamples[0].data.moo = 'mooon!';

        assert.equal( µExamples.get( 'moo' )[0], 'mooon!', 'get gets' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ set tests
     *
     * @test    set exists
     * @test    set sets
     */
    QUnit.test( '.set', function( assert )
    {
        assert.ok( µ().set, 'exists' );

        var µExamples   = µ( '.example--class' );
        µExamples.set( 'moo', 'mooon!' );

        var setData = µExamples[0].data.moo;

        assert.equal( setData, 'mooon!', 'set sets' );


        buildTest( 'No comparison available.' );
    });
};
