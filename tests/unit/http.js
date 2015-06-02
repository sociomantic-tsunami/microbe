/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'http.js' );


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
            console.log( e );
            assert.equal( e, 'Error: 404', 'errors are handled correctly' );
            errorTest();
        } );

        buildTest( 'Speed depends on network traffic.', 59 );
    });


    QUnit.test( '.http.get', function( assert )
    {
        assert.ok( µ.http.get, 'exists' );

        var getTest      = assert.async();

        µ.http.get( './httpTest.html' ).then( function( data )
        {
            assert.equal( data, 'moon', 'page correctly retrieved' );
            getTest();
        } );


        buildTest( 'Speed depends on network traffic.', 60 );
    });


    QUnit.test( '.http.post', function( assert )
    {
        assert.ok( µ.http.post, 'exists' );


        buildTest( 'Speed depends on network traffic.', 61 );
    });
};
