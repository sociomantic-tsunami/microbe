/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'core.js' );


    QUnit.test( 'µ().version', function( assert )
    {
        var version = '0.3.1';

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
        assert.equal( µ( 'head' ).length, 1, 'length reports correctly' );
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

        var classData = µ( '.moo' )[0].data.class.class;

        assert.ok( classData.indexOf( 'moo') !== -1, 'class sets data' );

        µ( '.moo' ).removeClass( 'moo' ).removeClass( 'for--real' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        var resetDivs = function()
        {
            for ( var i = 0, lenI = µDivs.length; i < lenI; i++ )
            {
                µDivs[ i ].className.replace( 'moo', '' );
            }
        };

        buildTest(
        'µDivs.addClass( \'moo\' )', function()
        {
            µDivs.addClass( 'moo' );

            resetDivs();
        },

        '$Divs.addClass( \'moo\' )', function()
        {
            $Divs.addClass( 'moo' );

            resetDivs();
        }, 21 );
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

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( '<div.a--new--div>' );
        // assert.deepEqual( µ( '.a--new--div' )[0], µTarget.children()[0], 'attached by creation string' );
        // µ( '.a--new--div' ).remove();

        var µAnotherNewDiv = µ( '<div.a--new--div>' );

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( [ µNewDiv, µAnotherNewDiv ] );
        // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 microbes' );
        // µNewDiv.remove();
        // µAnotherNewDiv.remove();

        µTarget.append( [ µNewDiv[0], µAnotherNewDiv[0] ] );
        assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 elements' );
        µNewDiv.remove();
        µAnotherNewDiv.remove();

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( [ '<div.a--new--div>', '<div.a--new--div>' ] );
        // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 creation strings' );
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

        buildTest(
        'µDivs.attr( \'moo\', \'moooooooooooooon\' )', function()
        {
            µDivs.attr( 'moo', 'moooooooooooooon' );

            vanillaRemove();
        },

        '$Divs.attr( \'moo\', \'moooooooooooooon\' )', function()
        {
            $Divs.attr( 'moo', 'moooooooooooooon' );

            vanillaRemove();
        }, 23 );
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


    QUnit.test( '.filter()', function( assert )
    {
        assert.ok( µ().find, 'exists' );
    });


    QUnit.test( '.find()', function( assert )
    {
        assert.ok( µ().find, 'exists' );
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
        µFirstDiv.append( µ( '<divdiv.divide>' )[0] );

        µ( 'divdiv' ).remove();

        assert.equal( µ( 'divdiv' ).length, 0, 'is completely removed' );
    });


    QUnit.test( '.removeClass()', function( assert )
    {
        assert.ok( µ().removeClass, 'exists' );

        var µDivs   = µ( '.example--class--groups' );
        µDivs.removeClass( 'example--class--groups' );

        var classData = µDivs[0].data.class.class;
        assert.ok( classData.indexOf( 'example--class--groups' ) === -1, 'removeClass sets data' );

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
        else // FF
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

        var µDivs = µ( 'div' );
        var extension = { more: function(){ return 'MOAR!!!'; } };
        µDivs.extend( extension );
        assert.equal( µDivs.more(), 'MOAR!!!', 'extends microbes' );

        var _obj = { a: 1, b: 2, c:3 };
        µ.extend( _obj, extension );
        assert.equal( _obj.more(), 'MOAR!!!', 'extends objects' );
    });


    QUnit.test( '.merge()', function( assert )
    {
        assert.ok( µ().merge, 'exists' );
        assert.ok( µ.merge, 'exists' );

        var µDivs       = µ( 'div' );
        var divCount    = µDivs.length;
        var µHtml       = µ( 'html' );
        var htmlCount   = µHtml.length;

        var merged      = µ.merge( µDivs, µHtml );
        assert.equal( divCount + htmlCount, merged.length, 'merged microbes' );

        merged = µ.merge( [ 1, 2, 3 ], [ 4, 5, 6 ] );
        assert.equal( 6, merged.length, 'merged arrays' );

        µDivs       = µ( 'div' );
        µDivs.merge( µHtml );
        assert.equal( µDivs.length, divCount + htmlCount, 'merged this' );
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
        var val = 'mooon';
        assert.equal( 'mooon', µ.identity( 'mooon' ), 'it equals itself' );
    });


    QUnit.test( '.noop()', function( assert )
    {
        assert.ok( µ.noop, 'noop exists' );
        assert.equal( µ.noop(), undefined, 'nothing happens' );

        assert.ok( µ.xyzzy, 'xyzzy exists' );
        assert.equal( µ.xyzzy(), undefined, 'nothing happens' );
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
        assert.ok( µ().toString() === '[object Microbe]', 'micriobe is a microbe' );
    });


    QUnit.test( '.toArray()', function( assert )
    {
        assert.ok( µ().toArray, 'exists' );
        assert.ok( µ.toArray, 'exists' );

        var arr = µ( 'div' ).toArray();
        assert.equal( µ.type( arr ), 'array', 'makes arrays' );
    });


    QUnit.test( '.type()', function( assert )
    {
        assert.ok( µ.type, 'exists' );
        assert.equal( µ.type( [] ), 'array', 'checks arrays' );
        assert.equal( µ.type( 2 ), 'number', 'checks numbers' );
        assert.equal( µ.type( {} ), 'object', 'checks objects' );
        assert.equal( µ.type( 'moin!' ), 'string', 'checks strings' );
        assert.equal( µ.type( new Date() ), 'date', 'checks dates' );
        assert.equal( µ.type( µ( 'div' ) ), 'microbe', 'checks microbes' );
        assert.equal( µ.type( /[0-9]/ ), 'regExp', 'checks regex' );
        assert.equal( µ.type( assert.ok ), 'function', 'checks functions' );
        assert.equal( µ.type( true ), 'boolean', 'checks boolean primitives' );
        assert.equal( µ.type( new Boolean( true ) ), 'object', 'checks boolean objects' );

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // assert.equal( µ.type( ), 'error', 'checks error objects' );

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // assert.equal( µ.type( ), 'promise', 'checks promises' );
    });
};

