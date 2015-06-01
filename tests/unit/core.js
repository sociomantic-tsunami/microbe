/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'core.js' );


    QUnit.test( 'µ().version', function( assert )
    {
        var version = '0.3.1';

        assert.equal( µ().version, version, 'version is ' + version );

        buildTest( 'No speed tests available.', 18 );
    });


    QUnit.test( 'µ().type', function( assert )
    {
        var type = '[object Microbe]';

        assert.equal( µ().type, type, 'type is ' + type );

        buildTest( 'No speed tests available.', 19 );
    });


    QUnit.test( 'µ().length', function( assert )
    {
        assert.equal( µ().length, 0, 'length initializes' );
        assert.equal( µ( 'head' ).length, 1, 'length reports correctly' );

        buildTest( 'No speed tests available.', 20 );
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
        

        var el;
        var µDiv = µ( 'div' ).first();
        var $Div = $( 'div' ).first();

        var vanillaRemove = function( el )
        {
            el.parentNode.removeChild( el );
        };

        buildTest(
        'µDiv.append( el )', function()
        {
            el = document.createElement( 'div' );
            µDiv.append( el );

            vanillaRemove( el );
        },

        '$Div.append( el )', function()
        {
            el = document.createElement( 'div' );
            $Div.append( el );

            vanillaRemove( el );
        }, 22 );
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

        buildTest( 'No comparison available.', 24 );
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
        }, 25 );
    });


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
        }, 26 );
    });


    QUnit.test( '.filter()', function( assert )
    {
        assert.ok( µ().filter, 'exists' );
        var µDivs   = µ( 'div' );
        var µId     = µDivs.filter( '#qunit' );

        assert.equal( µId.length, 1, 'selects the correct element' );

            µId     = µDivs.filter( ':lt(3)' );

        assert.equal( µId.length, 3, 'accepts pseudo selectors' );

        var $Divs;
        
        var resetDivs = function()
        {
            µDivs   = µ( 'div' );
            $Divs   = $( 'div' );
        };

        buildTest(
        'µDivs.filter( \'#qunit\' )', function()
        {
            resetDivs();
            µDivs.filter( '#qunit' );
        },

        '$Divs.filter( \'qunit\' )', function()
        {
            resetDivs();
            $Divs.filter( '#qunit' );
        }, 27 );
    });


    QUnit.test( '.find()', function( assert )
    {
        assert.ok( µ().find, 'exists' );

        var µDiv    = µ( '#qunit' );
        var µH2     = µDiv.find( 'h2' );

        assert.equal( µH2.length, 2, 'selects enough child elements' );

            µH2     = µDiv.find( ':first' );

        assert.equal( µH2.length, 1, 'accepts pseudo selectors' );


        var $Divs;
        
        var resetDivs = function()
        {
            µDivs   = µ( 'div' );
            $Divs   = $( 'div' );
        };

        buildTest(
        'µDivs.find( \'h2\' )', function()
        {
            resetDivs();
            µDivs.find( 'h2' );
        },

        '$Divs.find()', function()
        {
            resetDivs();
            $Divs.find( 'h2' );
        }, 28 );
    });


    QUnit.test( '.first()', function( assert )
    {
        assert.ok( µ().first, 'exists' );

        var µEverything = µ( '*' );
        var µFirst = µEverything.first();

        assert.equal( µFirst.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µFirst.length, 1, 'of length 1' );
        assert.deepEqual( µEverything[0], µFirst[0], 'that is actually the first one' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.first()', function()
        {
            µDivs.first();
        },

        '$Divs.first()', function()
        {
            $Divs.first();
        }, 29 );
    });


    QUnit.test( '.getParentIndex()', function( assert )
    {
        assert.ok( µ().getParentIndex, 'exists' );

        var setup       = µ( '#example--combined' ).parent().children()[0];

        var literal     = setup[3];
        var _function   = setup[ µ( '#example--combined' ).getParentIndex()[0] ];

        assert.deepEqual( literal, _function, 'parent index is correctly determined' );


        var µDiv = µ( 'div' ).first();
        var $Div = $( 'div' ).first();

        buildTest(
        'µDiv.getParentIndex()', function()
        {
            µDiv.getParentIndex();
        },

        '$Div.getParentIndex()', function()
        {
            var $DivParent  = $Div.parent();
            $DivParent.index( $Div );
        }, 30 );
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


        buildTest( 'No comparison available.', 31 );
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
        }, 32 );
    });


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
        }, 33 );
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


        var siblingDiv      = document.getElementById( 'qunit' );
        var µSiblingDiv     = µ( siblingDiv );
        var $SiblingDiv     = $( siblingDiv );
        var parentDiv       = siblingDiv.parentNode;

        var vanillaCreate = function( i )
        {
            var el  = document.createElement( 'div' );
            el      = [ µ( el ), $( el ) ];

            return el[ i ];
        };

        var vanillaRemove = function( el )
        {
            parentDiv.removeChild( el[ 0 ] );
        };

        buildTest(
        'µDiv.insertAfter( el )', function()
        {
            var µEl = vanillaCreate( 0 );

            µSiblingDiv.insertAfter( µEl );

            vanillaRemove( µEl );
        },

        '$Div.insertAfter( el )', function()
        {
            var $El = vanillaCreate( 1 );

            $El.insertAfter( $SiblingDiv );

            vanillaRemove( $El );
        }, 34 );
    });


    QUnit.test( '.last()', function( assert )
    {
        assert.ok( µ().last, 'exists' );

        var µEverything = µ( '*' );
        var µLast = µEverything.last();

        assert.equal( µLast.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µLast.length, 1, 'of length 1' );
        assert.deepEqual( µLast[0], µEverything[ µEverything.length - 1 ], 'that is actually the last one' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.last()', function()
        {
            µDivs.last();
        },

        '$Divs.last()', function()
        {
            $Divs.last();
        }, 35 );
    });


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
        'µDivs.last( function(){} )', function()
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
        }, 36 );
    });


    QUnit.test( '.parent()', function( assert )
    {
        assert.ok( µ().parent, 'exists' );

        var µBody   = µ( 'body' );
        var µParent = µBody.parent();

        assert.equal( µParent.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µParent.length, 1, 'of length 1' );
        assert.deepEqual( µParent[0], µ( 'html' )[0], 'that is actually the parent' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.parent()', function()
        {
            µDivs.parent();
        },

        '$Divs.parent()', function()
        {
            $Divs.parent();
        }, 37 );
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
        }, 38 );
    });


    QUnit.test( '.remove()', function( assert )
    {
        assert.ok( µ().remove, 'exists' );

        var µFirstDiv   = µ( 'div' ).first();
        µFirstDiv.append( µ( '<divdiv.divide>' )[0] );

        µ( 'divdiv' ).remove();

        assert.equal( µ( 'divdiv' ).length, 0, 'is completely removed' );

        var $El, µEl;
        var parentDiv   = µ( 'div' )[0];

        var vanillaAdd = function()
        {
            el = document.createElement( 'div' );
            µEl         = µ( el );
            $El         = $( el );

            parentDiv.appendChild( el );
            return el;
        };

        buildTest(
        'µDiv.remove()', function()
        {
            vanillaAdd();
            µEl.remove();
        },

        '$Div.remove()', function()
        {
            vanillaAdd();
            $El.remove();
        }, 39 );
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
        }, 40 );
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

        buildTest( 'No comparison available.', 41 );
    });


    QUnit.test( '.splice()', function( assert )
    {
        assert.ok( µ().splice, 'exists' );
        assert.equal( µ( 'div' ).splice( 0, 5 ).length, 5, 'is the correct length' );

        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.splice( 0, 5 )', function()
        {
            µDiv.splice( 0, 5 );
        },

        'µDiv.splice( 0, 5 )', function()
        {
            $Div.splice( 0, 5 );
        }, 42 );
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

        µTarget = µ( '#example--id' );
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
        }, 43 );
    });


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
        }, 44 );
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


        buildTest(
        'µ.extend( _obj, extension );', function()
        {
            /* these are commented out to draw attention to how slow the 
               other function is comparatively.  this one is quite a bit faster */
            // extension = { more: function(){ return 'MOAR!!!'; } };
            // _obj = µ( 'div' );
            // _obj.extend( extension );

            extension   = { more: function(){ return 'MOAR!!!'; } };
            _obj        = { a: 1, b: 2, c:3 };
            µ.extend( _obj, extension );
        },

        '$.extend( _obj, extension )', function()
        {
            /* these are commented out to draw attention to how slow the 
               other function is comparatively.  this one is quite a bit faster */
            // extension   = { more: function(){ return 'MOAR!!!'; } };
            // _obj = $( 'div' );
            // _obj.extend( extension );

            extension   = { more: function(){ return 'MOAR!!!'; } };
            _obj        = { a: 1, b: 2, c:3 };
            $.extend( _obj, extension );
        }, 45 );
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


        var µDivs, $Divs, µLi, $Li;

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
        }, 46 );
    });


    QUnit.test( '.capitalize()', function( assert )
    {
        assert.ok( µ.capitalize, 'exists' );
        assert.ok( µ.capitalise, 'exists' );
        assert.ok( µ.capitalise( 'i dont know' ) === 'I Dont Know', 'capitalizes strings' );

        var strArr = [ 'i dont know', 'for real' ];
            strArr = µ.capitalize( strArr );
        assert.ok( strArr[0] === 'I Dont Know' && strArr[1] === 'For Real', 'capitalizes string arrays' );

        buildTest( 'No comparison available.', 47 );
    });


    QUnit.test( '.identity()', function( assert )
    {
        assert.ok( µ.identity, 'exists' );
        var val = 'mooon';
        assert.equal( 'mooon', µ.identity( 'mooon' ), 'it equals itself' );

        buildTest( 'No speed tests available.', 48 );
    });


    QUnit.test( '.noop()', function( assert )
    {
        assert.ok( µ.noop, 'noop exists' );
        assert.equal( µ.noop(), undefined, 'nothing happens' );

        assert.ok( µ.xyzzy, 'xyzzy exists' );
        assert.equal( µ.xyzzy(), undefined, 'nothing happens' );

        buildTest( 'No speed tests available.', 49 );
    });


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
        }, 50 );
    });


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
        }, 51 );
    });


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
        }, 52 );
    });


    QUnit.test( '.isObject()', function( assert )
    {
        assert.ok( µ.isObject, 'exists' );
        assert.ok( µ.isObject( {} ), 'true on object' );
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
        }, 53 );
    });


    QUnit.test( '.isUndefined()', function( assert )
    {
        var parent = { a: 1 };
        assert.ok( µ.isUndefined, 'exists' );
        assert.ok( !µ.isUndefined( 'a', parent ), 'false if parent contains property' );
        assert.ok( µ.isUndefined( 'b', parent ), 'true otherwise' );

        buildTest( 'No comparison available.', 54 );
    });


    QUnit.test( '.isWindow()', function( assert )
    {
        assert.ok( µ.isWindow, 'exists' );
        assert.ok( µ.isWindow( window ), 'true on window' );
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
        }, 55 );
    });


    QUnit.test( '.toString()', function( assert )
    {
        assert.ok( µ().toString, 'exists' );
        assert.ok( µ.toString, 'exists' );
        assert.ok( µ().toString() === '[object Microbe]', 'micriobe is a microbe' );

        buildTest(
        'µ.toString', function()
        {
            µ.toString( µ );
            µ.toString( [ 1, 2, 3 ] );
        },

        '$.toString', function()
        {
            $.toString( $ );
            $.toString( [ 1, 2, 3 ] );
        }, 56 );
    });


    QUnit.test( '.toArray()', function( assert )
    {
        assert.ok( µ().toArray, 'exists' );
        assert.ok( µ.toArray, 'exists' );

        var arr = µ( 'div' ).toArray();
        assert.equal( µ.type( arr ), 'array', 'makes arrays' );

        buildTest( 'No comparison available.', 57 );
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
        assert.equal( µ.type( new Error() ), 'error', 'checks error objects' );
        assert.equal( µ.type( new Promise(function(){}) ), 'promise', 'checks promises' );

        buildTest(
        'µ.type', function()
        {
            µ.type( [] );
            µ.type( 2 );
            µ.type( {} );
            µ.type( 'moin!' );
            µ.type( new Date() );
            µ.type( µ( 'div' ) );
            µ.type( /[0-9]/ );
            µ.type( assert.ok );
            µ.type( true );
            µ.type( new Boolean( true ) );
            µ.type( new Error() );
            µ.type( new Promise(function(){}) );
        },

        '$.type', function()
        {
            $.type( [] );
            $.type( 2 );
            $.type( {} );
            $.type( 'moin!' );
            $.type( new Date() );
            $.type( $( 'div' ) );
            $.type( /[0-9]/ );
            $.type( assert.ok );
            $.type( true );
            $.type( new Boolean( true ) );
            $.type( new Error() );
            $.type( new Promise(function(){}) );
        }, 58 );
    });
};

