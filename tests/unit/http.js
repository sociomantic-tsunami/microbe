/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'http.js' );


    /**
     * µ http tests
     *
     * @test    http exists
     * @test    page correctly retrieved
     * @test    parameters are recieved correctly
     * @test    errors are handled correctly
     */
    QUnit.test( '.http', function( assert )
    {
        assert.ok( µ.http, 'exists' );

        var getTest      = assert.async();
        µ.http( { url: './httpTest.html', method: 'GET' } ).then( function( data )
        {
            assert.equal( data, 'moon', 'page correctly retrieved' );
            getTest();
        } );

        var parameterTest      = assert.async();
        µ.http( {
                    url         : './httpTest.html',
                    method      : 'GET',
                    headers     : {
                        Accept      : 'text/plain'
                    },
                    async       : true
                }
        ).then( function( data )
        {
            assert.equal( data, 'moon', 'parameters are recieved correctly' );
            parameterTest();
        } );

        var errorTest      = assert.async();
        µ.http( { url : './httpTest.hml' }
        ).catch( function( e )
        {
            e = ( e instanceof Error );
            assert.equal( e, true, 'errors are handled correctly' );
            errorTest();
        } );

        buildTest( 'Speed depends on network traffic.' );
    });


    /**
     * µ http.get tests
     *
     * @test    http.get exists
     * @test    page correctly retrieved
     */
    QUnit.test( '.http.get', function( assert )
    {
        assert.ok( µ.http.get, 'exists' );

        var getTest      = assert.async();

        µ.http.get( './httpTest.html' ).then( function( data )
        {
            assert.equal( data, 'moon', 'page correctly retrieved' );
            getTest();
        } );


        buildTest( 'Speed depends on network traffic.' );
    });


    /**
     * µ http.post tests
     *
     * @test    http.post exists
     */
    QUnit.test( '.http.post', function( assert )
    {
        assert.ok( µ.http.post, 'exists' );


        buildTest( 'Speed depends on network traffic.' );
    });
};
