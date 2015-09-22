/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'tools.js' );


    /**
     * µ capitalize tests
     *
     * @test    capitalize exists
     * @test    capitalise exists
     * @test    capitalizes strings
     * @test    capitalizes string arrays
     */
    QUnit.test( '.capitalize()', function( assert )
    {
        assert.ok( µ.capitalize, 'capitalize exists' );
        assert.ok( µ.capitalise, 'capitalise exists' );
        assert.ok( µ.capitalise( 'i dont know' ) === 'I Dont Know', 'capitalizes strings' );

        var strArr = [ 'i dont know', 'for real' ];
            strArr = µ.capitalize( strArr );
        assert.ok( strArr[0] === 'I Dont Know' && strArr[1] === 'For Real', 'capitalizes string arrays' );

        var str = 'i dont know';
        // http://stackoverflow.com/questions/22576425/capitalize-first-letter-in-a-string-with-letters-and-numbers-using-jquery#22576505
        buildTest( 'µ.capitalize()', function()
        {
            return µ.capitalize( str );
        }, 'stack overflow accepted answer', function()
        {
            strArr = str.split( ' ' );
            strArr = strArr.map( function( val )
            {
                return val.replace( /([a-z])/, function ( match, value )
                {
                    return value.toUpperCase();
                } );
            } );
            return strArr.join( ' ' );
        } );
    });


    /**
     * µ debounce tests
     *
     * @test    debounce exists
     * @test    reuns on it's timer
     */
    QUnit.test( '.debounce()', function( assert )
    {
        assert.ok( µ.debounce, 'exists' );

        var i   = 1;
        var _f  = µ.debounce( function(){ i++; return i; }, 50 );
        _f();
        _f();
        _f();

        var multiplesTest      = assert.async();

        setTimeout( function( _f )
        {
            assert.equal( i, 2, 'runs on it\'s timer' );
            multiplesTest();
        }, 60 );

        buildTest( 'No speed tests available.' );
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
        assert.ok( µ.extend, 'root exists' );

        var extension   = { more: function(){ return 'MOAR!!!'; } };
        var _obj        = { a: 1, b: 2, c: 3 };

        µ.extend( _obj, extension );
        assert.equal( _obj.more(), 'MOAR!!!', 'extends objects' );

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


    if ( typeof µ === 'function' )
    {  
        /**
         * µ extend tests
         *
         * @test    extend exists
         * @test    extends microbes
         * @test    extends objects
         */
        QUnit.test( 'µ().extend()', function( assert )
        {
            assert.ok( µ().extend, 'core exists' );

            var µDivs = µ( 'div' );
            var extension = { more: function(){ return 'MOAR!!!'; } };
            µDivs.extend( extension );
            assert.equal( µDivs.more(), 'MOAR!!!', 'extends microbes' );

                µDivs = µ( 'divs' );
            var $Divs = µ( 'divs' );

            buildTest(
            'µ.extend( _obj, extension );', function()
            {
                extension = { more: function(){ return 'MOAR!!!'; } };
                µDivs.extend( extension );
            },

            '$.extend( _obj, extension )', function()
            {
                extension   = { more: function(){ return 'MOAR!!!'; } };
                $Divs.extend( extension );
            } );
        });
    }


    /**
     * µ identity tests
     *
     * @test    identity exists
     * @test    it equals itself
     */
    QUnit.test( '.identity()', function( assert )
    {
        assert.ok( µ.identity, 'exists' );
        var val = 'mooon';
        assert.equal( 'mooon', µ.identity( 'mooon' ), 'it equals itself' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ insertStyle tests
     *
     * @test    insertStyle exists
     */
    QUnit.test( '.insertStyle()', function( assert )
    {
        assert.ok( µ.insertStyle, 'exists' );

        µ.insertStyle( '#qunit', { 'color':'#f0f' } );
        var savedColor = µ.__customCSSRules[ '#qunit' ].none.obj.color;

        assert.equal( $( '#qunit' ).css( 'color' ), 'rgb(255, 0, 255)', 'sets the rule' ); // ...
        assert.equal( savedColor, '#f0f', 'saves the reference' );

        µ.removeStyle( '#qunit' );

        var media = 'screen and (min-width : 600px)';
        µ.insertStyle( '#qunit', { 'color':'#f0f' }, media );

        assert.ok( µ.__customCSSRules[ '#qunit' ][ media ], 'inserts media queries' );
        µ.removeStyle( '#qunit' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ isArray tests
     *
     * @test    isArray exists
     * @test    true for array
     * @test    false otherwise
     */
    QUnit.test( '.isArray()', function( assert )
    {
        assert.ok( µ.isArray, 'exists' );
        assert.ok( µ.isArray( [ 1, 2, 3 ] ), 'true for array' );
        assert.ok( !µ.isArray( { 1: 'a', 2: 'b' } ), 'false otherwise' );

        buildTest(
        'µ.isArray', function()
        {
            µ.isArray( {} );
            µ.isArray( [ 1, 2, 3 ] );
        },

        '$.isArray', function()
        {
            $.isArray( {} );
            $.isArray( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ isEmpty tests
     *
     * @test    isEmpty exists
     * @test    true for empty
     * @test    false otherwise
     */
    QUnit.test( '.isEmpty()', function( assert )
    {
        assert.ok( µ.isEmpty, 'exists' );
        assert.ok( µ.isEmpty( {} ), 'true on empty' );
        assert.ok( !µ.isEmpty( { a: 1 } ), 'false otherwise' );

        buildTest(
        'µ.isEmpty', function()
        {
            µ.isEmpty( {} );
            µ.isEmpty( { a: 2 } );
        },

        '$.isEmptyObject', function()
        {
            $.isEmptyObject( {} );
            $.isEmptyObject( { a: 2 } );
        } );
    });


    /**
     * µ isFunction tests
     *
     * @test    isFunction exists
     * @test    true for function
     * @test    false otherwise
     */
    QUnit.test( '.isFunction()', function( assert )
    {
        assert.ok( µ.isFunction, 'exists' );
        assert.ok( µ.isFunction( assert.ok ), 'true on function' );
        assert.ok( !µ.isFunction( {} ), 'false otherwise' );

        buildTest(
        'µ.isFunction', function()
        {
            µ.isFunction( function(){} );
            µ.isFunction( [ 1, 2, 3 ] );
        },

        '$.isFunction', function()
        {
            $.isFunction( function(){} );
            $.isFunction( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ isObject tests
     *
     * @test    isObject exists
     * @test    true for objects
     * @test    false otherwise
     */
    QUnit.test( '.isObject()', function( assert )
    {
        assert.ok( µ.isObject, 'exists' );
        assert.ok( µ.isObject( {} ), 'true for objects' );
        assert.ok( !µ.isObject( 'ä' ), 'false otherwise' );

        buildTest(
        'µ.isObject', function()
        {
            µ.isObject( {} );
            µ.isObject( [ 1, 2, 3 ] );
        },

        '$.isPlainObject', function()
        {
            $.isPlainObject( {} );
            $.isPlainObject( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ isUndefined tests
     *
     * @test    isUndefined exists
     * @test    false if parent contains property
     * @test    true otherwise
     */
    QUnit.test( '.isUndefined()', function( assert )
    {
        var parent = { a: 1 };
        assert.ok( µ.isUndefined, 'exists' );
        assert.ok( !µ.isUndefined( 'a', parent ), 'false if parent contains property' );
        assert.ok( µ.isUndefined( 'b', parent ), 'true otherwise' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ isWindow tests
     *
     * @test    isWindow exists
     * @test    true for window
     * @test    false otherwise
     */
    QUnit.test( '.isWindow()', function( assert )
    {
        assert.ok( µ.isWindow, 'exists' );
        assert.ok( µ.isWindow( window ), 'true for window' );
        assert.ok( !µ.isWindow( {} ), 'false otherwise' );

        buildTest(
        'µ.isWindow', function()
        {
            µ.isWindow( window );
            µ.isWindow( [ 1, 2, 3 ] );
        },

        '$.isWindow', function()
        {
            $.isWindow( window );
            $.isWindow( [ 1, 2, 3 ] );
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
        assert.ok( µ.merge, 'µ.merge exists' );

        var $Divs       = $( 'div' );
        var divCount    = $Divs.length;
        var $Html       = $( 'html' );
        var htmlCount   = $Html.length;

        var merged      = µ.merge( $Divs, $Html );
        assert.equal( divCount + htmlCount, merged.length, 'merged objects' );

        merged = µ.merge( [ 1, 2, 3 ], [ 4, 5, 6 ] );
        assert.equal( 6, merged.length, 'merged arrays' );


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
            µ.merge( µDivs, µLi );
        },

        '$.merge( _obj, extension )', function()
        {
            refreshObjects();
            $.merge( $Divs, µLi );
        } );
    });


    if ( typeof µ === 'function' )
    {
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

            var µDivs       = µ( 'div' );
            var divCount    = µDivs.length;
            var µHtml       = µ( 'html' );
            var htmlCount   = µHtml.length;

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

            buildTest( 'No comparison available.' );
            // buildTest(
            // 'µDivs.merge( _obj, extension );', function()
            // {
            //     refreshObjects();
            //     µDivs.merge( µLi );
            // },

            // '$Divs.merge( _obj, extension )', function()
            // {
            //     refreshObjects();
            //     $Divs.merge( $Li );
            // } );
        });
    }


    /**
     * µ noop tests
     *
     * @test    noop exists
     * @test    nothing happens
     */
    QUnit.test( '.noop()', function( assert )
    {
        assert.ok( µ.noop, 'noop exists' );
        assert.equal( µ.noop(), undefined, 'nothing happens' );

        buildTest(
        'µ.noop()', function()
        {
            µ.noop();
        },

        '$.noop()', function()
        {
            $.noop();
        } );
    });


    /**
     * µ once tests
     *
     * @test    once exists
     */
    QUnit.test( '.once()', function( assert )
    {
        assert.ok( µ.once, 'exists' );
        var i   = 1;
        var _f  = µ.once( function(){ i++; return i; } );
        assert.equal( _f(), 2, 'runs once' );
        assert.equal( _f(), 2, 'and only once' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ poll tests
     *
     * @test    poll exists
     */
    QUnit.test( '.poll()', function( assert )
    {
        assert.expect( 3 );

        var _fail       = function(){ return false; };
        var _succees    = function(){ return true; };

        var failTest    = assert.async();

        assert.ok( µ.poll, 'exists' );

        µ.poll( _fail, _fail, function()
        {
            assert.ok( true, 'failure handled correctly' );
            failTest();
        }, 100, 25 );

        var successTest = assert.async();

        µ.poll( _succees, function()
        {
            assert.ok( true, 'success handled correctly' );
            successTest();
        }, _succees, 100, 25 );


        buildTest( 'No speed tests available.' );
    });


    /**
     * µ removeStyle tests
     *
     * @test    removeStyle exists
     */
    QUnit.test( '.removeStyle()', function( assert )
    {
        assert.ok( µ.removeStyle, 'exists' );

        µ.insertStyle( '#qunit', { 'color':'#f0f' } );

        var media = 'screen and (min-width : 600px)';
        µ.insertStyle( '#qunit', { 'display':'none' }, media );
        µ.removeStyle( '#qunit', media );

        assert.equal( $( '#qunit' ).css( 'display' ), 'block', 'removes individual media queries' ); // ...
        µ.removeStyle( '#qunit' );

        assert.ok( !µ.__customCSSRules[ '#qunit' ].none, 'removes base references' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ removeStyles tests
     *
     * @test    removeStyles exists
     */
    QUnit.test( '.removeStyles()', function( assert )
    {
        assert.ok( µ.removeStyles, 'exists' );

        µ.insertStyle( '#qunit', { 'color':'#f0f' } );

        var media = 'screen and (min-width : 600px)';
        µ.insertStyle( '#qunit', { 'display':'none' }, media );
        µ.removeStyles( '#qunit' );

        assert.equal( $( '#qunit' ).css( 'display' ), 'block', 'removes all tags' );
        assert.ok( !µ.__customCSSRules[ '#qunit' ].none && !µ.__customCSSRules[ '#qunit' ][ media ], 'removes all references' );

        buildTest( 'No speed tests available.' );
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
        assert.ok( µ.toArray, 'exists' );

        var $Arr = $( 'div' );
        assert.equal( µ.type( µ.toArray( $Arr ) ), 'array', 'makes arrays' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ type tests
     *
     * @test    µ.type exists
     * @test    checks arrays
     * @test    checks numbers
     * @test    checks objects
     * @test    checks strings
     * @test    checks dates
     * @test    checks microbes
     * @test    checks regex
     * @test    checks functions
     * @test    checks boolean primitives
     * @test    checks boolean objects
     * @test    checks error objects
     * @test    checks promises
     */
    QUnit.test( '.type()', function( assert )
    {
        window.Promise     = window.Promise || require( 'promise' );

        assert.ok( µ.type, 'exists' );
        assert.equal( µ.type( [] ), 'array', 'checks arrays' );
        assert.equal( µ.type( 2 ), 'number', 'checks numbers' );
        assert.equal( µ.type( {} ), 'object', 'checks objects' );
        assert.equal( µ.type( 'moin!' ), 'string', 'checks strings' );
        assert.equal( µ.type( new Date() ), 'date', 'checks dates' );
        assert.equal( µ.type( /[0-9]/ ), 'regExp', 'checks regex' );
        assert.equal( µ.type( assert.ok ), 'function', 'checks functions' );
        assert.equal( µ.type( true ), 'boolean', 'checks boolean primitives' );
        assert.equal( µ.type( new Boolean( true ) ), 'object', 'checks boolean objects' );
        assert.equal( µ.type( new Error() ), 'error', 'checks error objects' );
        assert.equal( µ.type( new Promise(function(){}) ), 'promise', 'checks promises' );

        if ( typeof µ === 'function' )
        {
            assert.equal( µ.type( µ( 'div' ) ), 'microbe', 'checks microbes' );
        }

        buildTest(
        'µ.type', function()
        {
            µ.type( [] );
            µ.type( 2 );
            µ.type( {} );
            µ.type( 'moin!' );
            µ.type( new Date() );
            µ.type( /[0-9]/ );
            µ.type( assert.ok );
            µ.type( true );
            µ.type( new Boolean( true ) );
            µ.type( new Error() );
            µ.type( new Promise(function(){}) );

            if ( typeof µ === 'function' )
            {
                µ.type( µ( 'div' ) );
            }
        },

        '$.type', function()
        {
            $.type( [] );
            $.type( 2 );
            $.type( {} );
            $.type( 'moin!' );
            $.type( new Date() );
            $.type( /[0-9]/ );
            $.type( assert.ok );
            $.type( true );
            $.type( new Boolean( true ) );
            $.type( new Error() );
            $.type( new Promise(function(){}) );

            if ( typeof µ === 'function' )
            {
                $.type( $( 'div' ) );
            }
        } );
    });


    /**
     * µ xyzzy tests
     *
     * @test    xyzzy exists
     * @test    nothing happens
     */
    QUnit.test( '.xyzzy()', function( assert )
    {
        assert.ok( µ.xyzzy, 'xyzzy exists' );
        assert.equal( µ.xyzzy(), undefined, 'nothing happens' );

        buildTest(
        'µ.xyzzy()', function()
        {
            µ.xyzzy();
        },

        '$.noop()', function()
        {
            $.noop();
        } );
    });
};