/*jshint expr: true */
/*global beforeEach, afterEach, describe, it, spyOn, xdescribe, xit, µ, chai */

var expect = chai.expect;
var type = function( obj )
{
    return Object.prototype.toString.call( obj );
};

describe( 'Microbe exists', function()
{
    it(' Expects Microbe to be present on the page.', function()
    {
        expect( µ ).to.be.a( 'function' );
    });
});

describe( 'Microbe can select elements', function()
{
    var realHead    = document.querySelector( 'head' );
    var realHTML    = document.querySelector( 'html' );

    it( 'Expects Microbe to select with \'string\' as parameter.', function()
    {
        var headString = µ( 'head' );
        expect( headString[0] ).to.equal( realHead );
    });

    it( 'Expects Microbe to select with \'HTMLelement\' as parameter.', function()
    {
        var headElem = µ( realHead );
        expect( headElem[0] ).to.equal( realHead );
    });

    it( 'Expects Microbe to select from a context.', function()
    {
        var headString  = µ( 'head', realHTML );
        var headElem    = µ( realHead, realHTML );
        expect( headString[0] ).to.equal( realHead );
        expect( headElem[0] ).to.equal( realHead );
    });
});

describe( 'Microbe can create elements', function()
{
    var realDiv = document.createElement('div');

    it('Expects Microbe to create with \'string\' as parameter.', function()
    {
        var divString = µ('<div>');
        expect( realDiv.isEqualNode( divString[0] ) ).to.equal( true );
    });

    it('Expects Microbe to create with \'HTMLElement\' as parameter.', function()
    {
        var divElem = µ.create(realDiv);
        expect( divElem[0] ).to.equal( realDiv );
    });
});

describe( 'Microbe can interact with attributes of elements', function()
{
    var head = µ( 'head' );

    it( 'Expects Microbe to get attributes.', function()
    {
        var link = µ('link');
        expect( link.attr( 'rel' ) ).to.equal( 'stylesheet' );

    });

    it( 'Expects Microbe to add attributes.', function()
    {
        head.attr( 'data-modified', 'false');
        expect( head.attr( 'data-modified' ) ).to.equal( 'false' );
    });

    it( 'Expects Microbe to modify attributes.', function()
    {
        head.attr( 'data-modified', 'true');
        expect( head.attr( 'data-modified' ) ).to.equal( 'true' );
    });

    it( 'Expects Microbe to remove attributes.', function()
    {
        head.attr( 'data-modified', null );
        expect( head.attr( 'data-modified' ) ).to.equal( undefined );
    });
});

describe( 'Microbe can interact with the style of elements', function()
{
    var div = µ( '#mocha' );

    it( 'Expects Microbe to get style.', function()
    {
        expect( div.css( 'margin-top' ) ).to.equal( '60px' );
    });

    it( 'Expects Microbe to add style.', function()
    {
        div.css( 'margin-top', '1px');
        expect( div.css( 'margin-top' ) ).to.equal( '1px' );
    });

    it( 'Expects Microbe to modify style.', function()
    {
        div.css( 'margin-top', '25px');
        expect( div.css( 'margin-top' ) ).to.equal( '25px' );
    });

    it( 'Expects Microbe to remove style.', function()
    {
        div.css( 'margin-top', null );
        expect( div.css( 'margin-top' ) ).to.equal( '60px' ); //original
    });
});


describe( 'Microbe has an http module', function()
{
    var http = µ.http;

    it( 'Expects Microbe to have an http module.', function()
    {
        expect( http ).to.be.a( 'function' );
    });

    describe( 'Http can handle GET requests.', function()
    {
        var get = http.get( '../lib/es6/microbe.js' );

        it( 'Expects http to send GET requests...', function()
        {
            expect( type( get ) ).to.equal( '[object Object]' );
            expect( get.then ).to.be.a( 'function' );
            expect( get.catch ).to.be.a( 'function' );
        });

        it( '... and get response and/or handle errors.', function(done)
        {
            get.then( function( results )
            {
                http({
                    url : '../lib/es6/microbe.js',
                    method : 'GET'
                }).then( function( res2 )
                {
                    expect( results ).to.be.a( 'string' );
                    expect( res2 ).to.equal( results );

                    http( 'NOT_FOUND' ).catch( function( error )
                    {
                        expect( error ).to.be.an( 'object' );
                        expect( error.message ).to.equal( '404' );
                        done();
                    });
                });
            });
        });
    });
    describe( 'Http can handle POST requests.', function()
    {
        var post = http({
            url : 'http://validate.jsontest.com/',
            method : 'POST',
            data : { my : 'post', is : 'working', fine : true }
        });

        it( 'Expects http to send POST requests...', function()
        {
            expect( type( post ) ).to.equal( '[object Object]' );
            expect( post.then ).to.be.a( 'function' );
            expect( post.catch ).to.be.a( 'function' );
        });

        it( '... and get response and/or handle errors.', function(done)
        {
            post.then( function( result )
            {
                expect( result ).to.be.a( 'string' );
                done();
            });
        });
    });

});
