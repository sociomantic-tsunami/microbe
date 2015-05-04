
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


QUnit.test( 'wrap an element', function( assert )
{
    var _body = document.getElementsByTagName( 'body' )[0];
    var µBody = µ( _body );

	assert.equal( µBody.length, 1, 'one body' );
  	assert.deepEqual( µBody[ 0 ], _body, 'passes' );

    test( 
    'µ( _el )', function() 
    {
        return µ( _body );
    },

    '$( _el )', function() 
    {
        return $( _body );
    }, 0 );
});


QUnit.test( 'query class', function( assert )
{
    var _div = document.getElementsByClassName( 'example--class' )[0];
    var µDiv = µ( '.example--class' );

    assert.equal( µDiv.length, 1, 'one div' );
    assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

    test( 
    'µ( \'.example--class\' )', function() 
    {
        return µ( '.example--class' );
    },

    '$( \'.example--class\' )', function() 
    {
        return $( '.example--class' );
    }, 1 );
});


QUnit.test( 'query id', function( assert )
{
    var _div = document.getElementById( 'example--id' );
    var µDiv = µ( '#example--id' );

    assert.equal( µDiv.length, 1, 'one div' );
    assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

    test( 
    'µ( \'#example--id\' )', function() 
    {
        return µ( '#example--id' );
    },

    '$( \'#example--id\' )', function() 
    {
        return $( '#example--id' );
    }, 2 );
});


QUnit.test( 'query tagname', function( assert )
{
    var _div = document.getElementsByTagName( 'div' )[0];
    var µDiv = µ( 'div' );

    assert.deepEqual( µDiv[ 0 ].tagName, 'DIV', 'passes' );
    assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

    test( 
    'µ( \'div\' )', function() 
    {
        return µ( 'div' );
    },

    '$( \'div\' )', function() 
    {
        return $( 'div' );
    }, 3 );
});


QUnit.test( 'query combined', function( assert )
{
    var _div = document.querySelector( 'div#example--combined.example--combined' );
    var µDiv = µ( 'div#example--combined.example--combined' );

    assert.equal( µDiv.length, 1, 'one div' );
    assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

    test( 
    'µ( \'div#example--combined.example--combined\' )', function() 
    {
        return µ( 'div#example--combined.example--combined' );
    },

    '$( \'div#example--combined.example--combined\' )', function() 
    {
        return $( 'div#example--combined.example--combined' );
    }, 4 );
});


// QUnit.test( 'query microbe scope', function( assert )
// {
//     var µDiv = µ( 'div', µ( '.example--class--groups' ) );

//     assert.equal( µDiv.length, 2, 'two divs' );
// });


QUnit.test( 'query element scope', function( assert )
{
    var _scopeEl = µ( '.example--class--groups' )[0];

    var µDiv = µ( 'div', _scopeEl );

    assert.equal( µDiv.length, 2, 'two divs' );
    assert.deepEqual( µDiv.first().parent()[0], _scopeEl, 'correct parent' );

    test( 
    'µ( \'div\', _scopeEl )', function() 
    {
        return µ( 'div', _scopeEl );
    },

    '$( \'div\', _scopeEl )', function() 
    {
        return $( 'div', _scopeEl );
    }, 5 );
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

    var µDivs = µ( 'div' );
    var $Divs = $( 'div' );

    var resetDivs = function()
    {
        for ( var i = 0, lenI = µDivs.length; i < lenI; i++ ) 
        {
            µDivs[ i ].className.replace( 'moo', '' );
        }
    }

    test( 
    'µDivs.addClass( \'moo\' )', function() 
    {
        µDivs.addClass( 'moo' );

        resetDivs();
    },

    '$Divs.addClass( \'moo\' )', function() 
    {
        $Divs.addClass( 'moo' );

        resetDivs();
    }, 9 );
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

    var newDiv = µ( '<div.this--is--a--new--div>' )[0];

    var µDivs = µ( 'div' );
    var $Divs = $( 'div' );

    test( 
    'µDivs.append( newDiv )', function() 
    {
        // µDivs.append( newDiv );
    },

    '$Divs.append( newDiv )', function() 
    {
        // $Divs.append( newDiv );
    }, 10 );
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


QUnit.test( '.each()', function( assert )
{
    assert.ok( µ().each, 'exists' );
});



var test    = function( _str1, _cb1, _str2, _cb2, testNum )
{
    setTimeout( function()
    {
        var µTests  = µ( '#qunit-tests' ).children()[0];

        var resDiv  = µTests[ testNum ];

        var µLi      = µ( 'li', resDiv );
        var µStrong  = µ( 'strong', resDiv );
        var testRes = [];
        var _arr    = [];
        var i       = 0;
        var libraries = [ 'µ', '$' ];

        var suite = new Benchmark.Suite;

        suite.add( _str1, _cb1 )
            .add( _str2, _cb2 )
            .on( 'cycle', function( event )
            {
                _arr.push( this[ i ].hz );
                var test = testRes[ i ] = µ( '<span.speed--result.slow>' )
                µ( µLi[ i ] ).append( test )
                test.html( String( event.target ) );

                i++;
            } )
            .on( 'complete', function() 
            {
                var fastest = _arr.indexOf( Math.max.apply( Math, _arr ) );
                testRes[ fastest ].removeClass( 'slow' );

                var µResult =  µ( '<span.fastest>' );
                µStrong.append( µResult );
                µResult.html( libraries[ fastest ] + ' is the fastest' );
            } )
            .run( { 'async': true } );
    }, 1000 );

    // var µTests  = µ( '#qunit-tests' ).children()[0];

    // var resDiv  = µTests[ testNum ];

    // var µLi      = µ( 'li', resDiv );
    // var µStrong  = µ( 'strong', resDiv );
    // var µResult =  µ( '<div.fastest>' );
    // µStrong.append( µResult );

    // var testRes = [];
    // var _arr    = [];
    // var i       = 0;
    // var libraries = [ 'µ', '$' ];
    // var suite = new Benchmark.Suite;

    // suite.add( _str1, _cb1 )
    //     .add( _str2, _cb2 )
    //     .on( 'cycle', function( event )
    //     {
    //         _arr.push( this[ i ].hz );
    //         var test = testRes[ i ] = µ( '<span.speed--result.slow>' )
    //         µ( µLi[ i ] ).append( test )
    //         test.html( String( event.target ) );

    //         i++;
    //     } )
    //     .on( 'complete', function() 
    //     {
    //         var fastest = _arr.indexOf( Math.max.apply( Math, _arr ) );
    //         testRes[ fastest ].removeClass( 'slow' );

    //         µResult.html( libraries[ fastest ] + ' is the fastest' );
    //     } );

    // var startTheTest = function()
    // {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     µResult.off();
    //     setTimeout( function()
    //     {
    //         suite.run( { 'async': true } );
    //     }, 1 );
    // };

    // µResult.html( 'Click to start the speed test' );
    // µResult.on( 'click', startTheTest );
};


