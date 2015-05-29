/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'observe.js' );


    QUnit.test( '.get', function( assert )
    {
        assert.ok( µ().get, 'exists' );

        var µExamples   = µ( '.example--class' );

        µExamples[0].data = µExamples[0].data || {};
        µExamples[0].data.moo = µExamples[0].data.moo || {};
        µExamples[0].data.moo.moo = 'mooon!';

        assert.equal( µExamples.get( 'moo' )[0], 'mooon!', 'get gets' );
    });


    QUnit.test( '.observe()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().observe, 'exists' );

        var µExamples   = µ( '.example--class' );

        var observeTest      = assert.async();

        µExamples.observe( 'observeTest', function( e )
        {
            assert.equal( typeof µExamples[0].data.observeTest._observeFunc, 'function', 'observe function stored' );
            µExamples.unobserve();
            assert.equal( e[0].object.observeTest, 'whoohoo', 'object correctly observed' );
            observeTest();
        });

        µExamples.set( 'observeTest', 'whoohoo' );
    });


    QUnit.test( '.observeOnce', function( assert )
    {
        assert.expect( 2 );

        assert.ok( µ().observeOnce, 'exists' );

        var µExamples   = µ( '.example--class' );

        var observeOnceTest      = assert.async();

        µExamples.observeOnce( 'observeOnceTest', function( e )
        {
            assert.equal( e[0].object.observeOnceTest, 'whoohoo', 'object correctly observed once' );

            observeOnceTest();
        });

        µExamples.set( 'observeOnceTest', 'whoohoo' );
    });


    QUnit.test( '.set', function( assert )
    {
        assert.ok( µ().set, 'exists' );

        var µExamples   = µ( '.example--class' );
        µExamples.set( 'moo', 'mooon!' );

        var setData = µExamples[0].data.moo.moo;

        assert.equal( setData, 'mooon!', 'set sets' );
    });


    QUnit.test( '.unobserve', function( assert )
    {
        assert.ok( µ().unobserve, 'exists' );
    });
};
