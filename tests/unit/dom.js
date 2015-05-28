/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'dom/index' );

    QUnit.test( 'µ.ready()', function( assert )
    {
        assert.ok( µ.ready, 'exists' );
    });

};
