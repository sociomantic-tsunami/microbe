
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

    var µDivs = µ( 'div' );
    var $Divs = $( 'div' );

    var vanillaRemove = function()
    {
        for ( var i = 0, lenI = µDivs.length; i < lenI; i++ ) 
        {
            µDivs[ i ].removeAttribute( 'moo' );
        }
    };

    test( 
    'µDivs.attr( \'moo\', \'moooooooooooooon\' )', function() 
    {
        µDivs.attr( 'moo', 'moooooooooooooon' );

        vanillaRemove();
    },

    '$Divs.attr( \'moo\', \'moooooooooooooon\' )', function() 
    {
        $Divs.attr( 'moo', 'moooooooooooooon' );

        vanillaRemove();
    }, 11 );
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
    assert.ok( typeof cssGotten[0] === 'string', 'full of strings' );
    assert.equal( cssGotten.length, µTarget.length, 'correct amount of results' );
    assert.equal( cssGotten[0], 'rgb(255, 0, 0)', 'correct result' );


    µTarget.css( 'background-color', null );
    assert.equal( µTarget[0].style.backgroundColor, '', 'css removed' );
});


QUnit.test( '.each()', function( assert )
{
    assert.ok( µ().each, 'exists' );

    var µDivs = µ( 'div' );
    var divs = [];
    µDivs.each( function( _el ){ divs.push( _el ); } );
    assert.equal( µDivs.length, divs.length, 'pushed each element' );
});


QUnit.test( '.first()', function( assert )
{
    assert.ok( µ().first, 'exists' );

    var µEverything = µ( '*' );
    var µFirst = µEverything.first();

    assert.equal( µFirst.type, '[object Microbe]', 'returns a microbe' );
    assert.equal( µFirst.length, 1, 'of length 1' );
    assert.deepEqual( µEverything[0], µFirst[0], 'that is actually the first one' );
});


QUnit.test( '.getParentIndex()', function( assert )
{
    assert.ok( µ().getParentIndex, 'exists' );

    var setup       = µ( '#example--combined' ).parent().children()[0];

    var literal     = setup[3];
    var _function   = setup[ µ( '#example--combined' ).getParentIndex()[0] ];

    assert.deepEqual( literal, _function, 'parent index is correctly determined' );
});


QUnit.test( '.hasClass()', function( assert )
{
    assert.ok( µ().hasClass, 'exists' );

    var µExampleClass = µ( '.example--class' );

    var exampleClass = µExampleClass.hasClass( 'example--class' );

    assert.ok( exampleClass.length === µExampleClass.length, 'it checks every element' );

    var correct = true;
    for ( var i = 0, lenI = exampleClass.length; i < lenI; i++ ) 
    {
        if ( ! exampleClass[ i ] )
        {
            correct = false;
            break;
        }
    }
    assert.ok( correct, 'correctly' );
});


QUnit.test( '.html()', function( assert )
{
    assert.ok( µ().html, 'exists' );

    var µTarget = µ( '#example--id' );

    µTarget.html( 'text, yo' );
    assert.equal( µTarget[0].innerHTML, 'text, yo', 'html set' );

    var htmlGotten = µTarget.html();
    assert.ok( µ.isArray( htmlGotten ), 'html() get returns an array' );
    assert.ok( typeof htmlGotten[0] === 'string', 'full of strings' );

    assert.equal( htmlGotten.length, µTarget.length, 'correct amount of results' );
    assert.equal( htmlGotten[0], 'text, yo', 'correct result' );
});


QUnit.test( '.html()', function( assert )
{
    assert.ok( µ().html, 'exists' );

    var µTarget = µ( '#example--id' );

    µTarget.html( 'text, yo' );
    assert.equal( µTarget[0].innerHTML, 'text, yo', 'html set' );

    var htmlGotten = µTarget.html();
    assert.ok( µ.isArray( htmlGotten ), 'html() get returns an array' );
    assert.ok( typeof htmlGotten[0] === 'string', 'full of strings' );

    assert.equal( htmlGotten.length, µTarget.length, 'correct amount of results' );
    assert.equal( htmlGotten[0], 'text, yo', 'correct result' );

    µTarget.html( '' );
});


QUnit.test( '.indexOf()', function( assert )
{
    assert.ok( µ().indexOf, 'exists' );

    var µTarget = µ( '#example--id' );

    var target  = document.getElementById( 'example--id' );
    var index   = µTarget.indexOf( target );

    assert.deepEqual( µTarget[ index ], target, 'index correctly determined' );
});


QUnit.test( '.insertAfter()', function( assert )
{
    assert.ok( µ().insertAfter, 'exists' );

    var µTarget = µ( '#example--id' );
    var µTargetIndex = µTarget.getParentIndex()[0];

    var µTargetParent = µTarget.parent();
    var µTargetParentChildren = µTargetParent.children()[0].length;

    var _el = '<addedDivThing>';
    µTarget.insertAfter( _el );
    assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by new string' );
    µ( 'addedDivThing' ).remove();


    var µEl = µ( _el );
    µTarget.insertAfter( µEl );
    assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by new microbe' );
    µ( 'addedDivThing' ).remove();

    µEl = µ( '<addedDivThing>' )[0];
    µTarget.insertAfter( µEl );
    assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by new element' );
    µ( 'addedDivThing' ).remove();
});


QUnit.test( '.last()', function( assert )
{
    assert.ok( µ().last, 'exists' );

    var µEverything = µ( '*' );
    var µLast = µEverything.last();

    assert.equal( µLast.type, '[object Microbe]', 'returns a microbe' );
    assert.equal( µLast.length, 1, 'of length 1' );
    assert.deepEqual( µLast[0], µEverything[ µEverything.length - 1 ], 'that is actually the last one' );
});


QUnit.test( '.map()', function( assert )
{
    assert.ok( µ().map, 'exists' );
});


QUnit.test( '.parent()', function( assert )
{
    assert.ok( µ().parent, 'exists' );

    var µBody   = µ( 'body' );
    var µParent = µBody.parent();

    assert.equal( µParent.type, '[object Microbe]', 'returns a microbe' );
    assert.equal( µParent.length, 1, 'of length 1' );
    assert.deepEqual( µParent[0], µ( 'html' )[0], 'that is actually the parent' );
});


QUnit.test( '.push()', function( assert )
{
    assert.ok( µ().push, 'exists' );

    var µDivs   = µ( 'div' );
    var µDivsLength = µDivs.length;
    var newDiv = µ( '<div>' )[0];

    µDivs.push( newDiv );

    assert.equal( µDivsLength + 1, µDivs.length, 'pushes to the microbe' );
    assert.deepEqual( newDiv, µDivs[ µDivs.length - 1 ], 'that is the correct element' );
});


QUnit.test( '.remove()', function( assert )
{
    assert.ok( µ().remove, 'exists' );

    var µFirstDiv   = µ( 'div' ).first();
    µFirstDiv.append( µ( '<divdiv>' )[0] );
    µ( 'divdiv' ).remove();

    assert.equal( µ( 'divdiv' ).length, 0, 'is completely removed' );
});


QUnit.test( '.removeClass()', function( assert )
{
    assert.ok( µ().removeClass, 'exists' );

    var µDivs   = µ( '.example--class--groups' );
    µDivs.removeClass( 'example--class--groups' );

    assert.equal( µ( '.example--class--groups' ).length, 0, 'removed class to both divs' );

    µDivs.addClass( 'example--class--groups' );
});


QUnit.test( '.selector()', function( assert )
{
    assert.ok( µ().selector, 'exists' );

    var _el = µ( '.example--class--groups' )[0];
    assert.equal( µ( _el ).selector(), 'div.example--class.example--class--groups', 'correctly parses classes' );

    _el = µ( '#microbe--example--dom' )[0];
    assert.equal( µ( _el ).selector(), 'div#microbe--example--dom', 'correctly parses ids' );

    _el = µ( '#example--combined' )[0];
    assert.equal( µ( _el ).selector(), 'div#example--combined.example--combined', 'correctly parses combined' );
});


QUnit.test( '.splice()', function( assert )
{
    assert.ok( µ().splice, 'exists' );
});


QUnit.test( '.text()', function( assert )
{
    assert.ok( µ().text, 'exists' );

    var µTarget = µ( '#example--id' );

    µTarget.text( 'text, yo' );

    var _text;
    if( document.all )
    {
        _text = µTarget[0].innerText;
    }
    else // stupid FF
    {
        _text = µTarget[0].textContent;
    }


    assert.equal( _text, 'text, yo', 'text set' );

    var textGotten = µTarget.text();
    assert.ok( µ.isArray( textGotten ), 'text() get returns an array' );
    assert.ok( typeof textGotten[0] === 'string', 'full of strings' );

    assert.equal( textGotten.length, µTarget.length, 'correct amount of results' );
    assert.equal( textGotten[0], 'text, yo', 'correct result' );

    µTarget.text( '' );
});


QUnit.test( '.toggleClass()', function( assert )
{
    assert.ok( µ().toggleClass, 'exists' );

    var µDivs   = µ( '.example--class--groups' );

    µDivs.toggleClass( 'example--class--groups' );
    assert.equal( µDivs.first().hasClass( 'example--class--groups' )[0], false, 'removes classes' );

    µDivs.toggleClass( 'example--class--groups' );
    assert.equal( µDivs.first().hasClass( 'example--class--groups' )[0], true, 'adds classes' );
});


QUnit.test( '.extend()', function( assert )
{
    assert.ok( µ().extend, 'exists' );
    assert.ok( µ.extend, 'exists' );
});


QUnit.test( '.merge()', function( assert )
{
    assert.ok( µ().merge, 'exists' );
    assert.ok( µ.merge, 'exists' );
});


QUnit.test( '.capitalize()', function( assert )
{
    assert.ok( µ.capitalize, 'exists' );
    assert.ok( µ.capitalise, 'exists' );
    assert.ok( µ.capitalise( 'i dont know' ) === 'I Dont Know', 'capitalizes strings' );

    var strArr = [ 'i dont know', 'for real' ];
        strArr = µ.capitalize( strArr );
    assert.ok( strArr[0] === 'I Dont Know' && strArr[1] === 'For Real', 'capitalizes string arrays' );
});


QUnit.test( '.identity()', function( assert )
{
    assert.ok( µ.identity, 'exists' );
});


QUnit.test( '.noop()', function( assert )
{
    assert.ok( µ.noop, 'exists' );
    assert.ok( µ.xyzzy, 'exists' );
    assert.equal( µ.noop(), undefined, 'nothing happens' );
});


QUnit.test( '.isArray()', function( assert )
{
    assert.ok( µ.isArray, 'exists' );
    assert.ok( µ.isArray( [ 1, 2, 3 ] ), 'true for array' );
    assert.ok( !µ.isArray( { 1: 'a', 2: 'b' } ), 'false otherwise' );
});


QUnit.test( '.isEmpty()', function( assert )
{
    assert.ok( µ.isEmpty, 'exists' );
    assert.ok( µ.isEmpty( {} ), 'true on empty' );
    assert.ok( !µ.isEmpty( { a: 1 } ), 'false otherwise' );
});


QUnit.test( '.isFunction()', function( assert )
{
    assert.ok( µ.isFunction, 'exists' );
    assert.ok( µ.isFunction( assert.ok ), 'true on function' );
    assert.ok( !µ.isFunction( {} ), 'false otherwise' );
});


QUnit.test( '.isObject()', function( assert )
{
    assert.ok( µ.isObject, 'exists' );
    assert.ok( µ.isObject( {} ), 'true on object' );
    assert.ok( !µ.isObject( 'ä' ), 'false otherwise' );
});


QUnit.test( '.isUndefined()', function( assert )
{
    var parent = { a: 1 };
    assert.ok( µ.isUndefined, 'exists' );
    assert.ok( !µ.isUndefined( 'a', parent ), 'false if parent contains property' );
    assert.ok( µ.isUndefined( 'b', parent ), 'true otherwise' );
});


QUnit.test( '.isWindow()', function( assert )
{
    assert.ok( µ.isWindow, 'exists' );
    assert.ok( µ.isWindow( window ), 'true on window' );
    assert.ok( !µ.isWindow( {} ), 'false otherwise' );
});


QUnit.test( '.toString()', function( assert )
{
    assert.ok( µ().toString, 'exists' );
    assert.ok( µ.toString, 'exists' );
    assert.ok( µ().toString() === '[object Microbe]', 'is a microbe' );
});


QUnit.test( '.toArray()', function( assert )
{
    assert.ok( µ().toArray, 'exists' );
    assert.ok( µ.toArray, 'exists' );
});


QUnit.test( '.type()', function( assert )
{
    assert.ok( µ.type, 'exists' );
});


/**
 * benchmark tests
 * 
 * @param  {str}                    _str1               test 1 name
 * @param  {func}                   _cb1                test 1
 * @param  {str}                    _str2               test 2 name
 * @param  {func}                   _cb2                test 2
 * @param  {int}                    testNum             test number
 * 
 * @return {void}
 */
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


