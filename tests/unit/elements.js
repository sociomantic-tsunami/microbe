 /* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'elements.js' );


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
            µDivs.attr( { 'moo': 'moooooooooooooon', 'a' : 1 } );

            vanillaRemove();
        },

        '$Divs.attr( \'moo\', \'moooooooooooooon\' )', function()
        {
            $Divs.attr( { 'moo': 'moooooooooooooon', 'a' : 1 } );

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

        µTarget.css( { 'background-color' : 'rgb(0, 255, 0)', 'color' : '#fff' } );
        assert.equal( µTarget[0].style.backgroundColor, 'rgb(0, 255, 0)', 'css object processed' );

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
      * µ height tests
      *
      * @test    height exists
      * @test    height gets
      * @test    height sets
      */
     QUnit.test( '.height()', function( assert )
     {
         assert.ok( µ().height, 'exists' );

         var µTarget    = µ( '#example--id' );
         var height     = µTarget.height()[0];

         assert.ok( typeof height === 'string' && height.indexOf ( 'px' ) !== -1 , 'height gotten' );

         var µTarget    = µ( '#example--id' );
         µTarget.height( '100px' );

         var height     = µTarget.height()[0];

         assert.equal( height , '100px', 'height set' );

         µTarget.height( '' );

         µTarget = µ( '#example--id' );
         var $Target = $( '#example--id' );

         buildTest(
         'µTarget.height( \'200px\' )', function()
         {
             µTarget.height( '200px' );
             µTarget.height();
         },

         '$Target.height( \'200px\' )', function()
         {
             $Target.height( '200px' );
             $Target.height();
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
     * µ offset tests
     *
     * @test    offset exists
     * @test    retrieves the correct index
     */
    QUnit.test( '.offset()', function( assert )
    {
        assert.ok( µ().offset, 'exists' );

        var bodyOffset  = µ( 'body' ).offset()[0];

        assert.equal( bodyOffset.top + bodyOffset.left, 0, 'correctly finds the body offset' );

        var qunitOffset = µ( '#qunit' ).offset()[0];

        assert.equal( qunitOffset.top + qunitOffset.left, 16, 'correctly finds the #qunit offset' );

        var $qunit = $( '#qunit' );

        var µQunit = µ( '#qunit' );
        var $qunit = $( '#qunit' );

        buildTest(
        'µQunit.offset()', function()
        {
            µQunit.offset();
        },

        '$qunit.offset()', function()
        {
            $qunit.offset();
        } );
    });


    /**
     * µ offset tests
     *
     * @test    offset exists
     * @test    retrieves the correct index
     */
    QUnit.test( '.position()', function( assert )
    {
        assert.ok( µ().position, 'exists' );

        var bodyPosition  = µ( 'body' ).position()[0];

        assert.equal( bodyPosition.top + bodyPosition.left, 0, 'correctly finds the body position' );

        var $qunit = $( '#qunit' );

        var µQunit = µ( '#qunit' );
        var $qunit = $( '#qunit' );

        buildTest(
        'µQunit.position()', function()
        {
            µQunit.position();
        },

        '$qunit.position()', function()
        {
            $qunit.position();
        } );
    });


    /**
     * µ removeClass tests
     *
     * @test    removeClass exists
     * @test    removes class in all elements
     */
    QUnit.test( '.removeClass()', function( assert )
    {
        assert.ok( µ().removeClass, 'exists' );

        var µDivs   = µ( '.example--class--groups' );
        µDivs.removeClass( 'example--class--groups' );

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
     * µ scroll tests
     *
     * @test    scroll exists
     * @test    retrieves the correct index
     */
    QUnit.test( '.scroll()', function( assert )
    {
        assert.ok( µ().scroll, 'exists' );

        var bodyscroll  = µ( 'body' ).scroll()[0];

        assert.equal( bodyscroll.top + bodyscroll.left, 0, 'correctly finds the body scroll' );

        var µQunit      = µ( '#qunit' );
        var qunitscroll = µQunit.scroll();

        assert.equal( qunitscroll[0].top + qunitscroll[0].left, 0, 'correctly finds the #qunit scroll' );

        assert.ok( qunitscroll.top.length === µQunit.length, 'correctly assigns top' );
        assert.ok( qunitscroll.left.length === µQunit.length, 'correctly assigns left' );

        var µQunit = µ( '#qunit' );
        var $qunit = $( '#qunit' );

        buildTest(
        'µQunit.scroll()', function()
        {
            µQunit.scroll();
        },

        '$qunit.scroll()', function()
        {
            $qunit.scroll();
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
     * µ value tests
     *
     * @test    value exists
     * @test    removes classes
     * @test    adds classes
     */
    QUnit.test( '.value()', function( assert )
    {
        assert.ok( µ().value, 'exists' );

        var µInputs   = µ( 'input' );

        µInputs.value( 'moon' );
        assert.equal( µInputs[0].value, 'moon', 'sets the value' );

        assert.equal( µInputs.value()[0], 'moon', 'gets the value' );

        µInputs.value( '' );
        assert.equal( µInputs.value()[0], '', 'clears the value' );


        µInputs     = µ( 'input' );
        var $input   = $( 'input' );

        buildTest(
        'µInputs.value( \'moo\' )', function()
        {
            µInputs.value( 'moo' );
        },

        '$input.value( \'moo\' )', function()
        {
            $input.value( 'moo' );
        } );
    });


    /**
     * µ width tests
     *
     * @test    width exists
     * @test    width gets
     * @test    width sets
     */
    QUnit.test( '.width()', function( assert )
    {
        assert.ok( µ().width, 'exists' );

        var µTarget    = µ( '#example--id' );
        var width     = µTarget.width()[0];

        assert.ok( typeof width === 'string' && width.indexOf ( 'px' ) !== -1 , 'width gotten' );

        var µTarget    = µ( '#example--id' );
        µTarget.width( '100px' );

        var width     = µTarget.width()[0];

        assert.equal( width , '100px', 'width set' );

        µTarget.width( '' );

        µTarget = µ( '#example--id' );
        var $Target = $( '#example--id' );

        buildTest(
        'µTarget.width( \'200px\' )', function()
        {
            µTarget.width( '200px' );
            µTarget.width();
        },

        '$Target.width( \'200px\' )', function()
        {
            $Target.width( '200px' );
            $Target.width();
        } );
    });
};

