/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'http.js' );


    QUnit.test( '.http', function( assert )
    {
        assert.ok( µ.http, 'exists' );
    });


    QUnit.test( '.http.get', function( assert )
    {
        assert.ok( µ.http.get, 'exists' );
    });


    QUnit.test( '.http.post', function( assert )
    {
        assert.ok( µ.http.post, 'exists' );
    });
};
