 /* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    var version = '0.4.5';


    QUnit.module( 'manipulators.js' );


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

