/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'observe.js' );


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
        µExamples[0].data.moo = µExamples[0].data.moo || {};
        µExamples[0].data.moo.moo = 'mooon!';

        assert.equal( µExamples.get( 'moo' )[0], 'mooon!', 'get gets' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ observe tests
     *
     * @test    observe exists
     * @test    observe function correctly stored
     * @test    object correctly observed
     */
    QUnit.test( '.observe()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().observe, 'exists' );

        var µExamples   = µ( '.example--class' );

        var observeTest = assert.async();

        µExamples.observe( 'observeTest', function( e )
        {
            assert.equal( typeof µExamples[0].data.observeTest._observeFunc, 'function', 'observe function stored' );
            µExamples.unobserve();
            assert.equal( e[0].object.observeTest, 'whoohoo', 'object correctly observed' );
            observeTest();
        });

        µExamples.set( 'observeTest', 'whoohoo' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ observeOnce tests
     *
     * @test    observeOnce exists
     * @test    object correctly observed
     */
    QUnit.test( '.observeOnce', function( assert )
    {
        assert.expect( 2 );

        assert.ok( µ().observeOnce, 'exists' );

        var µExamples   = µ( '.example--class' );

        var observeOnceTest      = assert.async();

        µExamples.observeOnce( 'observeOnceTest', function( e )
        {
            assert.equal( e[0].object.observeOnceTest, 'whoohoo', 'object correctly observed' );

            observeOnceTest();
        });

        µExamples.set( 'observeOnceTest', 'whoohoo' );


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

        var setData = µExamples[0].data.moo.moo;

        assert.equal( setData, 'mooon!', 'set sets' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ unobserve tests
     *
     * @test    unobserve exists
     */
    QUnit.test( '.unobserve', function( assert )
    {
        assert.ok( µ().unobserve, 'exists' );

        buildTest( 'No comparison available.' );
    });
};
