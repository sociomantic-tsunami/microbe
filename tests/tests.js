
/* global document, window, µ, QUnit  */

// test('asynchronous test', function() {
//     // Pause the test first
//     stop();

//     setTimeout(function() {
//         ok(true);

//         // After the assertion has been called,
//         // continue the test
//         start();
//     }, 100)
// })


QUnit.module( 'core/init' );


QUnit.test( 'wrap an element - 001a - slower', function( assert )
{
    var _body = document.getElementsByTagName( 'body' )[0];
    var µBody = µ( _body );

	assert.equal( µBody.length, 1, 'one body' );
  	assert.deepEqual( µBody[ 0 ], _body, 'passes' );
});


QUnit.test( 'query class - 002 - slower', function( assert )
{
    var _div = document.getElementsByClassName( 'example--class' )[0];
    var µDiv = µ( '.example--class' );

    assert.equal( µDiv.length, 1, 'one div' );
    assert.deepEqual( µDiv[ 0 ], _div, 'passes' );
});


QUnit.test( 'query id - 003 - slower', function( assert )
{
    var _div = document.getElementById( 'example--id' );
    var µDiv = µ( '#example--id' );

    assert.equal( µDiv.length, 1, 'one div' );
    assert.deepEqual( µDiv[ 0 ], _div, 'passes' );
});


QUnit.test( 'query tagname - 004 - slower', function( assert )
{
    var _div = document.getElementsByTagName( 'div' )[0];
    var µDiv = µ( 'div' );

    assert.deepEqual( µDiv[ 0 ], _div, 'passes' );
});


QUnit.test( 'query combined - 005 - slower', function( assert )
{
    var _div = document.querySelector( 'div#example--combined.example--combined' );
    var µDiv = µ( 'div#example--combined.example--combined' );

    assert.equal( µDiv.length, 1, 'one div' );
    assert.deepEqual( µDiv[ 0 ], _div, 'passes' );
});


// QUnit.test( 'query microbe scope', function( assert )
// {
//     var µDiv = µ( 'div', µ( '.example--class--groups' ) );

//     assert.equal( µDiv.length, 2, 'two divs' );
// });


QUnit.test( 'query element scope - 006 - slower', function( assert )
{
    var µDiv = µ( 'div', µ( '.example--class--groups' )[0] );

    assert.equal( µDiv.length, 2, 'two divs' );
});


// QUnit.test( 'query string scope', function( assert )
// {
//     var µDiv = µ( 'div', '.example--class--groups' );

//     assert.equal( µDiv.length, 2, 'two divs' );
// });



QUnit.module( 'core/index' );


QUnit.test( 'µ().version', function( assert )
{
    var version = '0.3';

    assert.equal( µ().version, version, 'version is ' + version );
});


QUnit.test( 'µ().type', function( assert )
{
    var type = '[object Microbe]';

    assert.equal( µ().type, type, 'type is ' + type );
});


QUnit.test( 'µ().length', function( assert )
{
    assert.equal( µ().length, 0, 'length initializes' );
    assert.equal( µ( 'div' ).length, 8, 'length reports correctly' );
});


QUnit.test( '.addClass()', function( assert )
{
    assert.ok( µ().addClass, 'exists' );

    var µMooDivs        = µ( 'div' ).addClass( 'moo' );
    var µMooDivsLength  = µMooDivs.length;

    assert.equal( µMooDivsLength, µ( '.moo' ).length, 'it added a class!' );
    assert.ok( µMooDivs.get( 'class' )[0].indexOf( 'moo' ) !== -1, 'it set the class into the data object' );

    µ( '.moo' ).removeClass( 'moo' );

    µMooDivs = µ( 'div' ).addClass( [ 'moo', 'for--real' ] ).length;
    assert.equal( µMooDivs, µ( '.moo.for--real' ).length, 'it added 2 classes from an array of strings' );

    µ( '.moo' ).removeClass( 'moo' ).removeClass( 'for--real' );
});


QUnit.test( '.append()', function( assert )
{
    assert.ok( µ().append, 'exists' );

    var µNewDiv = µ( '<div.a--new--div>' );
    var µTarget = µ( '#example--id' );

    µTarget.append( µNewDiv );
    assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached microbe' );
    µNewDiv.remove();

    µTarget.append( µNewDiv[0] );
    assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached element' );
    µNewDiv.remove();

    // µTarget.append( '<div.a--new--div>' );
    // assert.deepEqual( µ( '.a--new--div' )[0], µTarget.children()[0], 'attached by creation string' );
    // µ( '.a--new--div' ).remove();

    var µAnotherNewDiv = µ( '<div.a--new--div>' );

    // µTarget.append( [ µNewDiv, µAnotherNewDiv ] );
    // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 microbes' );
    // µNewDiv.remove();
    // µAnotherNewDiv.remove();

    µTarget.append( [ µNewDiv[0], µAnotherNewDiv[0] ] );
    assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 elements' );
    µNewDiv.remove();
    µAnotherNewDiv.remove();

    // µTarget.append( [ '<div.a--new--div>', '<div.a--new--div>' ] );
    // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 creation stringd' );
    // µNewDiv.remove();
    // µAnotherNewDiv.remove();
});


QUnit.test( '.attr()', function( assert )
{
    assert.ok( µ().attr, 'exists' );

    var µTarget = µ( '#example--id' );

    µTarget.attr( 'testing', 'should work' );
    assert.equal( µTarget[0].getAttribute( 'testing' ), 'should work', 'attribute set' );

    var attrGotten = µTarget.attr( 'testing' );
    assert.equal( attrGotten[0], 'should work', 'attribute gotten' );

    µTarget.attr( 'testing', null );
    assert.equal( µTarget[0].getAttribute( 'testing' ), null, 'attribute removed' );
});


QUnit.test( '.children()', function( assert )
{
    assert.ok( µ().children, 'exists' );

    var children = µ( '.example--class' ).children();

    assert.ok( µ.isArray( children ), 'returns an array' );
    assert.ok( children[0].type === '[object Microbe]', 'full of microbes' );
    assert.deepEqual( µ( '.example--class' )[0].children[0], children[0][0], 'the correct children' );
});


QUnit.test( '.css()', function( assert )
{
    assert.ok( µ().css, 'exists' );

    var µTarget = µ( '#example--id' );

    µTarget.css( 'background-color', 'rgb(255, 0, 0)' );
    assert.equal( µTarget[0].style.backgroundColor, 'rgb(255, 0, 0)', 'css set' );

    var cssGotten = µTarget.css( 'background-color' );
    assert.ok( µ.isArray( cssGotten ), 'css get returns an array' );
    assert.ok( cssGotten[0].length, 'full of strings' );
    assert.equal( cssGotten.length, µTarget.length, 'correct amount of results' );
    assert.equal( cssGotten[0], 'rgb(255, 0, 0)', 'correct result' );


    µTarget.css( 'background-color', null );
    assert.equal( µTarget[0].style.backgroundColor, '', 'css removed' );
});

