 /* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    var version = '0.4.4';

    var _observables = µ().get ? true : false;

    QUnit.module( 'core.js' );


    /**
     * µ addClass tests
     *
     * @test    addClass exists
     * @test    adds a class
     * @test    sets the data object
     * @test    sets multiple classes from an array
     * @test    multiple classes all set to data object
     * @test    multiple classes set by className string
     */
    QUnit.test( '.addClass()', function( assert )
    {
        assert.ok( µ().addClass, 'exists' );

        var µMooDivs        = µ( 'div' ).addClass( 'moo' );
        var µMooDivsLength  = µMooDivs.length;

        assert.equal( µMooDivsLength, µ( '.moo' ).length, 'it added a class!' );

        µ( '.moo' ).removeClass( 'moo' );

        µMooDivs = µ( 'div' ).first().addClass( [ 'moo', 'for--real' ] );
        assert.equal( µMooDivs.length, µ( '.moo.for--real' ).length, 'it added 2 classes from an array of strings' );

        var µDiv = µ( 'div' ).addClass( µMooDivs[0].className );
        assert.equal( µDiv.length, µ( '.moo.for--real' ).length, 'multiple classes set by className string' );

        if ( _observables )
        {
            assert.ok( µMooDivs.get( 'class' )[0].indexOf( 'moo' ) !== -1, 'it set the class into the data object' );
            var classData = µ( '.moo' )[0].data.class.class;
            assert.ok( classData.indexOf( 'for--real' ) !== -1, 'class sets data' );
        }

        µ( '.moo' ).removeClass( 'moo  for--real' );

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
        } );
    });


    /**
     * µ attr tests
     *
     * @test    attr exists
     * @test    sets an attr
     * @test    retrieves an attr
     * @test    removes an attr
     */
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

        µTarget.attr( { testing: 'tested', moon: 'doge' } );
        assert.equal( µTarget[0].getAttribute( 'moon' ), 'doge', 'attributes bulk added by object' );

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
        } );
    });


    /**
     * µ css tests
     *
     * @test    css exists
     * @test    sets css
     * @test    retrieves a css array
     * @test    full of strings
     * @test    with the correct number of results
     * @test    with the correct results
     * @test    removes css
     */
    QUnit.test( '.css()', function( assert )
    {
        assert.ok( µ().css, 'exists' );

        var µTarget = µ( '#example--id' );

        µTarget.css( 'background-color', 'rgb(255, 0, 0)' );
        assert.equal( µTarget[0].style.backgroundColor, 'rgb(255, 0, 0)', 'css set' );

        var cssGotten = µTarget.css( 'background-color' );
        assert.ok( Array.isArray( cssGotten ), 'css get returns an array' );
        assert.ok( typeof cssGotten[0] === 'string', 'full of strings' );
        assert.equal( cssGotten.length, µTarget.length, 'correct amount of results' );
        assert.equal( cssGotten[0], 'rgb(255, 0, 0)', 'correct result' );


        µTarget.css( 'background-color', null );
        assert.equal( µTarget[0].style.backgroundColor, '', 'css removed' );


        µTarget = µ( '#example--id' );
        var $Target = $( '#example--id' );

        buildTest(
        'µTarget.css( \'background-color\', \'#f00\' )', function()
        {
            µTarget.css( 'background-color', '#f00' );
            µTarget.css( 'background-color', null );
        },

        '$Target.css( \'background-color\', \'#f00\' )', function()
        {
            $Target.css( 'background-color', '#f00' );
            $Target.css( 'background-color', null );
        } );
    });


    /**
     * µ each tests
     *
     * @test    each exists
     * @test    affects each element
     * @test    correctly
     */
    QUnit.test( '.each()', function( assert )
    {
        assert.ok( µ().each, 'exists' );

        var µDivs   = µ( 'div' );
        var divs    = [];

        µDivs.each( function( _el ){ divs.push( _el ); } );
        assert.equal( µDivs.length, divs.length, 'pushed each element' );
        assert.deepEqual( µDivs[ 0 ], divs[ 0 ], 'correct result' );

        µDivs       = µ( 'div' );
        var $Divs   = $( 'div' );

        buildTest(
        'µDivs.each( function( _el, i ){} )', function()
        {
            var arr = [];
            µDivs.each( function( _el, i )
            {
                arr.push( _el.id );
            } );
        },

        '$Divs.each( function( _el, i ){} )', function()
        {
            var arr = [];
            $Divs.each( function( _el, i )
            {
                arr.push( _el.id );
            } );
        } );
    });



    /**
     * µ extend tests
     *
     * @test    extend exists
     * @test    extends microbes
     * @test    extends objects
     */
    QUnit.test( '.extend()', function( assert )
    {
        assert.ok( µ().extend, 'core exists' );
        assert.ok( µ.extend, 'root exists' );

        var µDivs = µ( 'div' );
        var extension = { more: function(){ return 'MOAR!!!'; } };
        µDivs.extend( extension );
        assert.equal( µDivs.more(), 'MOAR!!!', 'extends microbes' );

        var _obj = { a: 1, b: 2, c:3 };
        µ.extend( _obj, extension );
        assert.equal( _obj.more(), 'MOAR!!!', 'extends objects' );

            µDivs = µ( 'divs' );
        var $Divs = µ( 'divs' );

        buildTest(
        'µ.extend( _obj, extension );', function()
        {
            extension = { more: function(){ return 'MOAR!!!'; } };
            // µDivs.extend( extension );
            _obj        = { a: 1, b: 2, c:3 };
            µ.extend( _obj, extension );
        },

        '$.extend( _obj, extension )', function()
        {
            extension   = { more: function(){ return 'MOAR!!!'; } };
            // $Divs.extend( extension );
            _obj        = { a: 1, b: 2, c:3 };
            $.extend( _obj, extension );
        } );
    });


    /**
     * µ getParentIndex tests
     *
     * @test    getParentIndex exists
     * @test    retrieves the correct index
     */
    QUnit.test( '.getParentIndex()', function( assert )
    {
        assert.ok( µ().getParentIndex, 'exists' );

        var setup       = µ( '#example--combined' ).parent().children()[0];

        var literal     = setup[4];
        var _function   = setup[ µ( '#example--combined' ).getParentIndex()[0] ];

        assert.deepEqual( literal, _function, 'parent index is correctly determined' );

        var µDiv = µ( 'div' ), $Div = $( 'div' );

        buildTest(
        'µDiv.getParentIndex()', function()
        {
            µDiv.getParentIndex();
        },

        '$Div for loop', function()
        {
            var res = new Array( $Div.length );
            for ( var i = 0, lenI = $Div.length; i < lenI; i++ )
            {
                res[ i ] = $( $Div[ i ] ).index();
            }

            return res;
        } );
    });


    /**
     * µ hasClass tests
     *
     * @test    hasClass exists
     * @test    checks every element
     * @test    correctly
     */
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

        var µDiv = µ( 'div' ), $Div = $( 'div' );
        buildTest(
        'µDiv.hasClass()', function()
        {
            µDiv.hasClass();
        },

        '$Div for loop', function()
        {
            var res = new Array( $Div.length );
            for ( var i = 0, lenI = $Div.length; i < lenI; i++ )
            {
                res[ i ] = $( $Div[ i ] ).hasClass();
            }

            return res;
        } );
    });


    /**
     * µ html tests
     *
     * @test    html exists
     * @test    html sets
     * @test    returns an array
     * @test    full of strings
     * @test    with the correct number of results
     * @test    with the correct results
     */
    QUnit.test( '.html()', function( assert )
    {
        assert.ok( µ().html, 'exists' );

        var µTarget = µ( '#example--id' );

        µTarget.html( 'text, yo' );
        assert.equal( µTarget[0].innerHTML, 'text, yo', 'html set' );

        var htmlGotten = µTarget.html();
        assert.ok( Array.isArray( htmlGotten ), 'html() returns an array' );
        assert.ok( typeof htmlGotten[0] === 'string', 'full of strings' );

        assert.equal( htmlGotten.length, µTarget.length, 'correct amount of results' );
        assert.equal( htmlGotten[0], 'text, yo', 'correct result' );

        µTarget.html( '' );


        µTarget = µ( '#example--id' );
        var $Target = $( '#example--id' );

        buildTest(
        'µTarget.html( \'blarg\' )', function()
        {
            µTarget.html( 'blarg' );
            µTarget.html();
        },

        '$Target.html( \'blarg\' )', function()
        {
            $Target.html( 'blarg' );
            $Target.html();
        } );
    });


    /**
     * µ indexOf tests
     *
     * @test    indexOf exists
     * @test    indexOf correctly determines the index
     */
    QUnit.test( '.indexOf()', function( assert )
    {
        assert.ok( µ().indexOf, 'exists' );

        var µTarget = µ( '#example--id' );

        var target  = document.getElementById( 'example--id' );
        var index   = µTarget.indexOf( target );

        assert.deepEqual( µTarget[ index ], target, 'index correctly determined' );

        var µDivs   = µ( 'div' );
        var $Divs   = $( 'div' );
        var _el     = document.getElementById( 'QUnit' );

        buildTest(
        'µDivs.indexOf( _el )', function()
        {
            µDivs.indexOf( _el );
        },

        '$Divs.index( _el )', function()
        {
            $Divs.index( _el );
        } );
    });


    /**
     * µ map tests
     *
     * @test    map exists
     * @test    applies to all elements
     */
    QUnit.test( '.map()', function( assert )
    {
        assert.ok( µ().map, 'exists' );

        var µDivs = µ( 'div' );

        µDivs.map( function( el )
        {
            el.moo = 'moo';
        } );

        var rand = Math.floor( Math.random() * µDivs.length );

        assert.equal( µDivs[ rand ].moo, 'moo', 'applies to all elements' );


            µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        var resetDivs = function()
        {
            µDivs = µ( 'div' );
            $Divs = $( 'div' );
        };


        buildTest(
        'µDivs.map( function(){} )', function()
        {
            resetDivs();

            µDivs.map( function( el )
            {
                el.moo = 'moo';
            } );
        },

        '$Divs.map( function(){} )', function()
        {
            resetDivs();

            $Divs.map( function( el )
            {
                el.moo = 'moo';
            } );
        } );
    });


    /**
     * µ merge tests
     *
     * @test    µ().merge exists
     * @test    µ.merge exists
     * @test    merged microbes
     * @test    merged arrays
     * @test    merged this
     */
    QUnit.test( '.merge()', function( assert )
    {
        assert.ok( µ().merge, 'µ().merge exists' );
        assert.ok( µ.merge, 'µ.merge exists' );

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


        var $Divs, µLi, $Li;

        var refreshObjects = function()
        {
            µDivs = µ( 'div' );
            $Divs = $( 'div' );

            µLi = µ( 'li' );
            $Li = $( 'li' );
        };


        buildTest(
        'µ.merge( _obj, extension );', function()
        {
            refreshObjects();

            /* these are commented out because jquery doesn't handle this syntax */
            // µDivs.merge( µLi );

            µ.merge( µDivs, µLi );
        },

        '$.merge( _obj, extension )', function()
        {
            refreshObjects();

            /* these are commented out because jquery doesn't handle this syntax */
            // $Divs.merge( $Li );

            $.merge( $Divs, µLi );
        } );
    });


    /**
     * µ push tests
     *
     * @test    push exists
     * @test    pushes to the microbe
     * @test    the correctc element
     */
    QUnit.test( '.push()', function( assert )
    {
        assert.ok( µ().push, 'exists' );

        var µDivs   = µ( 'div' );
        var µDivsLength = µDivs.length;
        var newDiv = µ( '<div>' )[0];

        µDivs.push( newDiv );

        assert.equal( µDivsLength + 1, µDivs.length, 'pushes to the microbe' );
        assert.deepEqual( newDiv, µDivs[ µDivs.length - 1 ], 'the correct element' );

        var _el;
        var µEmpty = µ( [] );
        var $Empty = $( [] );

        buildTest(
        'µEmpty.push( _el )', function()
        {
            _el = document.getElementById( 'QUnit' );
            µEmpty.push( _el );
        },

        '$Empty.push( _el )', function()
        {
            _el = document.getElementById( 'QUnit' );
            $Empty.push( _el );
        } );
    });


    /**
     * µ removeClass tests
     *
     * @test    removeClass exists
     * @test    sets data
     * @test    removes class in all elements
     */
    QUnit.test( '.removeClass()', function( assert )
    {
        assert.ok( µ().removeClass, 'exists' );

        var µDivs   = µ( '.example--class--groups' );
        µDivs.removeClass( 'example--class--groups' );

        var classData = µDivs[0].data.class.class;
        assert.ok( classData.indexOf( 'example--class--groups' ) === -1, 'removeClass sets data' );

        assert.equal( µ( '.example--class--groups' ).length, 0, 'removed class to both divs' );

        µ( '#qunit' ).addClass( 'test--yyy  test--zzz' );
        µ( '#qunit' ).removeClass( µ( '#qunit' )[0].className );
        assert.equal( 0, µ( '.test--yyy.test--zzz' ).length, 'multiple classes removed by className string' );

        µDivs.addClass( 'example--class--groups' );

            µDivs   = µ( '.example--class--groups' );
        var $Divs   = $( '.example--class--groups' );

        var resetDivs = function()
        {
          for ( var i = 0, lenI = µDivs.length; i < lenI; i++ )
          {
              µDivs[ i ].className += ' moo';
          }
        };

        buildTest(
        'µDivs.removeClass( \'moo\' )', function()
        {
          µDivs.removeClass( 'moo' );

          resetDivs();
        },

        '$Divs.removeClass( \'moo\' )', function()
        {
          $Divs.removeClass( 'moo' );

          resetDivs();
        } );
    });


    /**
     * µ text tests
     *
     * @test    text exists
     * @test    text sets
     * @test    returns an array
     * @test    full of strings
     * @test    with the correct number of results
     * @test    with the correct results
     */
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
        assert.ok( Array.isArray( textGotten ), 'text() get returns an array' );
        assert.ok( typeof textGotten[0] === 'string', 'full of strings' );

        assert.equal( textGotten.length, µTarget.length, 'correct amount of results' );
        assert.equal( textGotten[0], 'text, yo', 'correct result' );

        µTarget.text( '' );

        µTarget     = µ( '#example--id' );
        var $Target = $( '#example--id' );

        buildTest(
        'µTarget.text( \'blarg\' )', function()
        {
            µTarget.text( 'blarg' );
            µTarget.text();
        },

        '$Target.text( \'blarg\' )', function()
        {
            $Target.text( 'blarg' );
            $Target.text();
        } );
    });


     /**
      * µ toArray tests
      *
      * @test    µ().toArray exists
      * @test    µ.toArray exists
      * @test    makes arrays
      */
     QUnit.test( '.toArray()', function( assert )
     {
         assert.ok( µ().toArray, 'exists' );

         var µArr = µ( 'div' );
         var $arr = $( 'div' );
         assert.equal( µ.type( µArr.toArray() ), 'array', 'makes arrays' );

         buildTest(
         'µ.toArray', function()
         {
             µArr.toArray();
         },

         '$.toArray', function()
         {
             $arr.toArray();
         } );
     });


    /**
     * µ toggleClass tests
     *
     * @test    toggleClass exists
     * @test    removes classes
     * @test    adds classes
     */
    QUnit.test( '.toggleClass()', function( assert )
    {
        assert.ok( µ().toggleClass, 'exists' );

        var µDivs   = µ( '.example--class--groups' );

        µDivs.toggleClass( 'example--class--groups' );
        assert.equal( µDivs.first().hasClass( 'example--class--groups' )[0], false, 'removes classes' );

        µDivs.toggleClass( 'example--class--groups' );
        assert.equal( µDivs.first().hasClass( 'example--class--groups' )[0], true, 'adds classes' );

            µDivs   = µ( '.example--class--groups' );
        var $Divs   = $( '.example--class--groups' );

        buildTest(
        'µDivs.toggleClass( \'moo\' )', function()
        {
            µDivs.toggleClass( 'moo' );
        },

        '$Divs.toggleClass( \'moo\' )', function()
        {
            $Divs.toggleClass( 'moo' );
        } );
    });


    /**
     * µ type test
     *
     * @test    type exists
     */
    QUnit.test( '.type', function( assert )
    {
        var type = '[object Microbe]';

        assert.equal( µ().type, type, 'type is ' + type );

        buildTest( 'No speed tests available for non-functions' );
    });


    /**
     * µ version test
     *
     * @test    version exists
     */
    QUnit.test( '.version', function( assert )
    {
        assert.equal( µ().version, version, 'version is ' + version );

        buildTest( 'No speed tests available for non-functions' );
    });
};

