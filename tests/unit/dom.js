/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'dom.js' );

    QUnit.test( 'µ.ready()', function( assert )
    {
        assert.ok( µ.ready, 'exists' );

        var domReady    = assert.async();

        var loaded = function()
        {
            assert.equal( µ( 'h1' ).length, 1, 'is run after dom loads' );

            domReady();
        };

        µ.ready( loaded );


        buildTest( 'No speed tests available.', 62 );
    });

};
