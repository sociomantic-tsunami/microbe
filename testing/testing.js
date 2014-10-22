/* global document, window, µ, xµ, $, performance */

/**
 * Microbe test suite
 *
 * the first functions are setups for the tests, then for each test there is
 * an array of functions, and the testLoop function call
 */

/**
 * assorted variables
 */
var µFrameworkWrapper, µCodeWrapper, µTimeWrapper, µTestWrapper,
    frameworks = [ 'native', '$', 'µ', 'old µ' ],
    iterations = 250, slowIterations = 100;

/**
 * html escape
 *
 * escapes code for <pre> display
 *
 * @param  {str}                    str                 str to convert
 *
 * @return {str}                                        escaped string
 */
var htmlEscape = function( str )
{
    return String( str )
            .replace( /&/g, '&amp;' )
            .replace( /"/g, '&quot;' )
            .replace( /'/g, '&#39;' )
            .replace( /</g, '&lt;' )
            .replace( />/g, '&gt;') ;
};


/**
 * Test - Present
 *
 * formats the results for html display and adds them to the page
 *
 * @param  {str}                    testName            name of the test
 * @param  {ar}                     results             results
 * @param  {arr}                    code                code used in the test
 *
 * @return {void}
 */
var testPresent = function( testName, results, code )
{
    var fastest = 99999, µResults            = µ( '.results' );
    var µTestsWrapper           = µ( '<div.tests__wrapper>' )
                    .html( '<div class="test__name">' + testName + '</div>' );

    for ( var i = 0, lenI = frameworks.length; i < lenI; i++ )
    {
        µTestWrapper        = µ( '<span.test__wrapper>' );
        µFrameworkWrapper   = µ( '<span.framework__wrapper>' ).html( frameworks[ i ] );
        µCodeWrapper        = µ( '<span.code__wrapper>' ).html( htmlEscape( code[ i ] ) );
        µTimeWrapper        = µ( '<span.time__wrapper>' )
                    .html( ( Math.floor( results[ i ] * 1000000000 ) / 1000000000 ) + 'ms' );

        if ( ( !results[ fastest ] || results[ i ] < results[ fastest ] ) && i !== 0 )
        {
            fastest = i;
        }

        µTestWrapper.attr( 'data-time', results[ i ] );

        µTestWrapper.append( µFrameworkWrapper ).append( µCodeWrapper )
                        .append( µTimeWrapper ).append( µ( '<br>' ) );

        µTestsWrapper.append( µTestWrapper );
    }
    var _fast = µ( µTestsWrapper.children()[ fastest + 1 ] );

    if ( _fast.attr( 'data-time' ) < results[ 0 ] )
    {
        _fast.addClass( 'fastestTest__beat-native' );
    }
    else
    {
        _fast.addClass( 'fastestTest' );
    }

    _fast = _fast.children();
    _fast[ 0 ].className = _fast[ 0 ].className + ' fastestFramework';
    _fast[ 1 ].className = _fast[ 1 ].className + ' fastestCode';
    _fast[ 2 ].className = _fast[ 2 ].className + ' fastestTime';

    µResults.append( µTestsWrapper );
};


/**
 * Timing test
 *
 * runs the test while grabbing a time stamp before and after
 *
 * @param  {func}                   test                test to run
 * @param  {str}                    query               selector
 *
 * @return {num}                                        timing
 */
var timingTest = function( test, query )
{
	var start = performance.now();
	test( query );
	var end = performance.now();

	return end - start;
};


/**
 * Reset
 *
 * resets the test divs to their original state
 *
 * @return {void}
 */
var reset = function()
{
    µ( '.js-testCases' ).html( '<div class="test1 test2">test</div>' +
            '<div class="test1" id="id">test</div>' +
            '<div class="test1" id="testId">' +
                '<div class="subTest">test</div>' +
            '</div>' );
};


/**
 * Test Loop
 *
 * loops through all 4 versions of the test while cataloging the timing results
 *
 * @param  {arr}                    testArray           array of test functions
 * @param  {str}                    query               selector string
 *
 * @return {array}                                      results && total time
 */
var testLoop = function( testArray, query )
{
	var resultsArray = [];

	for ( var j = 0; j < iterations; j++ )
	{
		for ( var i = 0, len = testArray.length; i < len; i++ )
		{
			if ( ! resultsArray[ i ] )
			{
				resultsArray[ i ] = [ 0 ];
			}

			resultsArray[ i ] = parseFloat( resultsArray[ i ] ) +
                                    timingTest( testArray[ i ], query );
		}
	}

	var total = 0;

	for ( var k = 0, lenK = resultsArray.length; k < lenK; k++ )
	{
		total += resultsArray[ k ];
		resultsArray[ k ] = resultsArray[ k ] / iterations;
	}
    reset();
	return [ resultsArray, total ];
};


/**
 *
 * Simple query
 *
 * tests the speed of various queries
 */
var simpleQueryResults, simpleQuery = [

    function( query )
    {
        var result = document.querySelectorAll( query );
        return result;
    },

    function( query)
    {
        var result = $( query );
        return result;
    },

	function( query )
	{
		var result = µ( query );
		return result;
	},

	function( query )
	{
		var result = xµ( query );
		return result;
	}
];

simpleQueryResults = testLoop( simpleQuery, '#id' );
testPresent( 'Query #id x ' + iterations + ' : total ' +
        simpleQueryResults[ 1 ], simpleQueryResults[ 0 ], simpleQuery );

simpleQueryResults = testLoop( simpleQuery, 'body' );
testPresent( 'Query body x ' + iterations + ' : total ' +
        simpleQueryResults[ 1 ], simpleQueryResults[ 0 ], simpleQuery );

simpleQueryResults = testLoop( simpleQuery, '.test1' );
testPresent( 'Query .test1 x ' + iterations + ' : total ' +
        simpleQueryResults[ 1 ], simpleQueryResults[ 0 ], simpleQuery );

simpleQueryResults = testLoop( simpleQuery, 'div.test1.test2' );
testPresent( 'Query div.test1.test2 x ' + iterations + ' : total ' +
        simpleQueryResults[ 1 ], simpleQueryResults[ 0 ], simpleQuery );

simpleQueryResults = testLoop( simpleQuery, 'div#test' );
testPresent( 'Query div#test x ' + iterations + ' : total ' +
        simpleQueryResults[ 1 ], simpleQueryResults[ 0 ], simpleQuery );


/**
 *
 * .addClass() test
 *
 * tests addClass by repeatedly adding the class 'moo'
 */
var addClassTest = [

    function( query )
    {
        var result, target  = document.querySelectorAll( query );
        for ( var i = 0, lenI = target.length; i < lenI; i++ )
        {
            result  = target[ i ].classList.add( 'moo' );
        }
        return result;
    },

    function( query )
    {
     var result = $( query ).addClass( 'moo' );
     return result;
    },

    function( query )
    {
     var result = µ( query ).addClass( 'moo' );
     return result;
    },

    function( query )
    {
     var result = xµ( query ).addClass( 'moo' );
     return result;
    }
];
var addClassTestResults = testLoop( addClassTest, '.test1' );
testPresent( '.addClass( ) test x ' + iterations + ' : total ' +
        addClassTestResults[ 1 ], addClassTestResults[ 0 ], addClassTest );


/**
 *
 * .append() test
 *
 * tests .append() by adding a new span to the queried elements
 */
var appendTest = [

    function( query )
    {
        var span, divs = document.querySelectorAll( query );

        for ( var i = 0, lenI = divs.length; i < lenI; i++ )
        {
            span = document.createElement( 'span' );
            divs[ i ].appendChild( span );
        }

        return divs;
    },

    function( query )
    {
        var span = $( '<span></span>' );
        var result = $( query ).append( span );
        return result;
    },

    function( query )
    {
        var span = µ( '<span>' );
        var result = µ( query ).append( span );
        return result;
    },

    function( query )
    {
        var span = xµ( '<span>' );
        var result = xµ( query ).append( span );
        return result;
    }
];
var appendTestResults = testLoop( appendTest, '.test1', slowIterations );
testPresent( '.append( ) test x ' + slowIterations + ' : total ' +
        appendTestResults[ 1 ], appendTestResults[ 0 ], appendTest );


/**
 *
 * .attr() test
 *
 * tests .attr() by adding and removing an attribute 'data-testdata'
 */
var attrTest = [

    function( query )
    {
        var _el = µ( query );
        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            _el[ i ].setAttribute( 'data-testdata', 'aStringIsBorn!' );
            _el[ i ].setAttribute( 'data-testdata', '' );
        }

        return _el;
    },

    function( query )
    {
        var result = $( query ).attr( 'data-testdata', 'aStringIsBorn!' )
                .attr( 'data-testdata', null );
        return result;
    },

    function( query )
    {
        var result = µ( query ).attr( 'data-testdata', 'aStringIsBorn!' )
                .attr( 'data-testdata', null );
        return result;
    },

    function( query )
    {
        var result = xµ( query ).attr( 'data-testdata', 'aStringIsBorn!' )
                .attr( 'data-testdata', null );
        return result;
    }
];
var attrTestResults = testLoop( attrTest, '.test1' );
testPresent( '.attr( ) test x ' + iterations + ' : total ' +
         attrTestResults[ 1 ], attrTestResults[ 0 ], attrTest );

// bind test skipped


/**
 *
 * .children() test
 *
 *  tests .children() by outputting an array of the children of the queried elements
 */
var childrenTest = [

    function( query )
    {
        var _el = document.querySelectorAll( query ), results = [];
        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            results.push( _el[ i ].childNodes );
        }

        return results;
    },

    function( query )
    {
        var result = $( query ), arr = [];
        for ( var i = 0, lenI = result.length; i < lenI; i++ )
        {
            arr.push( $( result[ i ] ).children() );
        }
        return arr;
    },

    function( query )
    {
        var result = µ( query ).children();
        return result;
    },

    function( query )
    {
        var result = xµ( query ).children();
        return result;
    }
];
var childrenTestResults = testLoop( childrenTest, '.test1' );
testPresent( '.children() test x ' + iterations + ' : total ' +
            childrenTestResults[ 1 ], childrenTestResults[ 0 ], childrenTest );


/**
 *
 * .create() test
 *
 * tests .create() by creating a div
 */
var createTest = [

    function( query )
    {
        var results = document.createElement( 'div' );

        return results;
    },

    function( query )
    {
        var result = $( '<div></div>' );
        return result;
    },

    function( query )
    {
        var result = µ( '<div>' );
        return result;
    },

    function( query )
    {
        var result = xµ( '<div>' );
        return result;
    }
];
var createTestResults = testLoop( createTest, 'dummy query doesnt do anything' );
testPresent( '.create( ) test x ' + iterations + ' : total ' +
            createTestResults[ 1 ], createTestResults[ 0 ], createTest );


/**
 *
 * .css() test
 *
 * tests .css() by changing the background color repeatedly
 */
var cssTest = [

    function( query )
    {
        var results = document.querySelectorAll( query );

        for ( var i = 0, lenI = results.length; i < lenI; i++ )
        {
            results[ i ].style.backgroundColor = '#fff';
            results[ i ].style.backgroundColor = 'rgba( 255, 255, 255, 0.6 )';
            results[ i ].style.backgroundColor = null;
        }

        return results;
    },

    function( query )
    {
        var result = $( query ).css( 'background-color', '#fff' )
                .css( 'background-color', 'rgba( 255, 255, 255, 0.6' )
                                .css( 'background-color', null );
        return result;
    },

    function( query )
    {
        var result = µ( query ).css( 'background-color', '#fff' )
                .css( 'background-color', 'rgba( 255, 255, 255, 0.6' )
                                .css( 'background-color', null );
        return result;
    },

    function( query )
    {
        var result = xµ( query ).css( 'background-color', '#fff' )
                .css( 'background-color', 'rgba( 255, 255, 255, 0.6' )
                                .css( 'background-color', null );
        return result;
    }
];
var cssTestResults = testLoop( cssTest, '.test1' );
testPresent( '.css( ) test x ' + iterations + ' : total ' +
            cssTestResults[ 1 ], cssTestResults[ 0 ], cssTest );


/**
 *
 * .each() test
 *
 * tests .each by running eachFunc with each item
 */
var eachFunc = function ( item, index )
{
    return Math.random() * 765765 % 56;
};
var eachTest = [

    function( query )
    {
        var results = document.querySelectorAll( query );

        for ( var i = 0, lenI = results.length; i < lenI; i++ )
        {
            eachFunc( results[ i ], i );
        }

        return results;
    },

    function( query )
    {
        var result = $( query ).each( eachFunc );
        return result;
    },

    function( query )
    {
        var result = µ( query ).each( eachFunc );
        return result;
    },

    function( query )
    {
        var result = xµ( query ).each( eachFunc );
        return result;
    }
];
var eachTestResults = testLoop( eachTest, '.test1' );
testPresent( '.each( ) test x ' + iterations + ' : total ' +
            eachTestResults[ 1 ], eachTestResults[ 0 ], eachTest );


/**
 *
 * .first() test
 *
 * tests .first() by returning the first result of a query
 */
var firstTest = [

    function( query )
    {
        var results = document.querySelectorAll( query );

        return results[ 0 ];
    },

    function( query )
    {
        var result = $( query ).first();
        return result;
    },

    function( query )
    {
        var result = µ( query ).first();
        return result;
    },

    function( query )
    {
        var result = xµ( query ).first();
        return result;
    }
];
var firstTestResults = testLoop( firstTest, '.test1' );
testPresent( '.first( ) test x ' + iterations + ' : total ' +
            firstTestResults[ 1 ], firstTestResults[ 0 ], firstTest );


// get() test skipped.... it's stupid


/**
 *
 * .getParentIndex() test
 *
 * tests .getParentIndex() by returning an array of indexes
 */
var getParentIndex = [

    function( query )
    {
        var array = [], arr, cn, result = document.querySelectorAll( query );
        for ( var i = 0, lenI = result.length; i < lenI; i++ )
        {
            arr = [];
            cn  = result[ i ].parentNode.childNodes;

            for( var j = 0, lenJ = cn.length; j < lenJ; j++ )
            {
                arr.push( cn[ j ] );
            }
            array.push( arr.indexOf( result[ i ] ) );
        }
        return array;
    },

    function( query )
    {
        var result = $( query );
        for ( var i = 0, lenI = result.length; i < lenI; i++ )
        {
            result[ i ] = result.index( result[ i ] );
        }
        return result;
    },

    function( query )
    {
        var result = µ( query ).getParentIndex();
        return result;
    },

    function( query )
    {
        var result = xµ( query ).getParentIndex();
        return result;
    }
];
var getParentIndexResults = testLoop( getParentIndex, '.test1' );
testPresent( '.getParentIndex( ) test x ' + iterations + ' : total ' +
            getParentIndexResults[ 1 ], getParentIndexResults[ 0 ], getParentIndex );


/**
 *
 * .hasClass() test
 *
 * tests .hasClass() by returning an array of booleans, whether or not the elements have the given class
 */
var hasClassTest = [

    function( query )
    {
        var result = document.querySelectorAll( query );
        for ( var i = 0, lenI = result.length; i < lenI; i++ )
        {
            result[ i ] = result[ i ].classList.contains( 'test2' );
        }
        return result;
    },

    function( query )
    {
        var result = $( query );
        for ( var i = 0, lenI = result.length; i < lenI; i++ )
        {
            result[ i ] = $( result[ i ] ).hasClass( 'test2' );
        }
        return result;
    },

    function( query )
    {
        var result = µ( query ).hasClass( 'test2' );
        return result;
    },

    function( query )
    {
        var result = xµ( query ).hasClass( 'test2' );
        return result;
    }
];
var hasClassTestResults = testLoop( hasClassTest, '.test1' );
testPresent( '.hasClass( ) test x ' + iterations + ' : total ' +
            hasClassTestResults[ 1 ], hasClassTestResults[ 0 ], hasClassTest );


/**
 *
 * .html() test
 *
 * tests .html() by changing the html in the element to 'test1'
 */
var htmlTest = [

    function( query )
    {
        var result = document.querySelectorAll( query );
        for ( var i = 0, lenI = result.length; i < lenI; i++ )
        {
            result[ i ].innerHTML = 'test1';
        }
        return result;
    },

    function( query )
    {
        var result = $( query ).html( 'test1' );
        $( query ).html();
        return result;
    },

    function( query )
    {
        var result = µ( query ).html( 'test1' );
        µ( query ).html();
        return result;
    },

    function( query )
    {
        var result = xµ( query ).html( 'test1' );
        xµ( query ).html();
        return result;
    }
];
var htmlTestResults = testLoop( htmlTest, '.test1' );
testPresent( '.html( ) test x ' + iterations + ' : total ' +
            htmlTestResults[ 1 ], htmlTestResults[ 0 ], htmlTest );


/**
 *
 * .indexOf() test
 *
 * tests .indexOf() by finding where in a query the second result is (I know....)
 */
var indexOf = [

    function( query )
    {
        var arr = [], result = document.querySelectorAll( query );

        for( var i = 0, lenI = result.length; i < lenI; i++ )
        {
            arr.push( result[ i ] );
        }
        return arr.indexOf( result[ 2 ] ) ;
    },

    function( query )
    {
        var result = $( query );
        result.index( result[ 2 ] );

        return result;
    },

    function( query )
    {
        var result = µ( query );
        result.indexOf( result[ 2 ] );
        return result;
    },

    function( query )
    {           // dummy function. this didnt exist in xµ
        var i = 0;
        while ( i < 30000 )
        { i++; } return true; }
];
var indexOfResults = testLoop( indexOf, '.test1' );
testPresent( '.indexOf( ) test x ' + iterations + ' : total ' +
            indexOfResults[ 1 ], indexOfResults[ 0 ], indexOf );


/**
 *
 * .insertAfter() test
 *
 * tests .insertAfter() by creating a span and inserting it after each of a queried list
 */
var insertAfter = [

    function( query )
    {
        var el = document.createElement( 'span' ); // vanilla to be consistant
        var result = document.querySelectorAll( query );
        for ( var i = 0, lenI = result.length; i < lenI; i++ )
        {
            result[ i ].parentNode.insertBefore( el, result[ i ].nextSibling );
        }
        return result;
    },

    function( query )
    {
        var el = $( '<span></span>' ); // jquery will only take a string or a $
        var result = $( query ).insertAfter( el );
    },

    function( query )
    {
        var el = document.createElement( 'span' ); // vanilla to be consistant
        var result = µ( query ).insertAfter( el );
        return result;
    },

    function( query )
    {
        var el = document.createElement( 'span' ); // vanilla to be consistant
        var result = xµ( query ).insertAfter( el );
        return result;
    }
];
var insertAfterResults = testLoop( insertAfter, '.test1' );
testPresent( '.insertAfter( ) test x ' + iterations + ' : total ' +
            insertAfterResults[ 1 ], insertAfterResults[ 0 ], insertAfter );


/**
 *
 * .last() test
 *
 * tests .last() by returning the last item of a query
 */
var lastTest = [

    function( query )
    {
        var results = document.querySelectorAll( query );

        return results[ results.length - 1 ];
    },

    function( query )
    {
        var result = $( query ).last();
        return result;
    },

    function( query )
    {
        var result = µ( query ).last();
        return result;
    },

    function( query )
    {
        var result = xµ( query ).last();
        return result;
    }
];
var lastTestResults = testLoop( lastTest, '.test1' );
testPresent( '.last( ) test x ' + iterations + ' : total ' +
            lastTestResults[ 1 ], lastTestResults[ 0 ], lastTest );


/**
 *
 * .map() test
 *
 * tests .map() by applying mapFunc to each element of a query
 */
var mapFunc = function ()
{
    var that = this;
    return Math.random() * 765765 % 56;
};
var mapTest = [

    function( query )
    {
        var results = document.querySelectorAll( query );

        for ( var i = 0, lenI = results.length; i < lenI; i++ )
        {
            mapFunc( results[ i ], i );
        }

        return results;
    },

    function( query )
    {
        var result = $( query ).map( mapFunc );
        return result;
    },

    function( query )
    {
        var result = µ( query ).map( mapFunc );
        return result;
    },

    function( query )
    {           // dummy function. this didnt exist in xµ
        var i = 0;
        while ( i < 50000 )
        { i++; } return true; }
];
var mapTestResults = testLoop( mapTest, '.test1' );
testPresent( '.map( ) test x ' + iterations + ' : total ' +
            mapTestResults[ 1 ], mapTestResults[ 0 ], mapTest );


/**
 *
 * .parent() test
 *
 * tests .parent() by returning an array of the parents of the queried elements
 */
var parentTest = [

    function( query )
    {
        var results = document.querySelectorAll( query );

        for ( var i = 0, lenI = results.length; i < lenI; i++ )
        {
            results[ i ] = results[ i ].parentNode;
        }
        return results;
    },

    function( query )
    {
        var result = $( query ).parent();
        return result;
    },

    function( query )
    {
        var result = µ( query ).parent();
        return result;
    },

    function( query )
    {
        var result = xµ( query ).parent();
        return result;
    }
];
var parentTestResults = testLoop( parentTest, '.test1' );
testPresent( '.parent( ) test x ' + iterations + ' : total ' +
            parentTestResults[ 1 ], parentTestResults[ 0 ], parentTest );


/**
 * .remove() test
 *
 * tests .remove() by adding an element (vanilla for continuity) then removing it
 */
var removeTest = [

    function( query )
    {
        var el = document.createElement( query );
        document.getElementsByTagName( 'body' )[0].appendChild( el );


        var results = document.querySelectorAll( query );

        for ( var i = 0, lenI = results.length; i < lenI; i++ )
        {
            results[ i ] = results[ i ].removeNode;
        }
        return results;
    },

    function( query )
    {
        var el = document.createElement( query );
        document.getElementsByTagName( 'body' )[0].appendChild( el );
        var result = $( query ).remove();
        return result;
    },

    function( query )
    {
        var el = document.createElement( query );
        document.getElementsByTagName( 'body' )[0].appendChild( el );
        var result = µ( query ).remove();
        return result;
    },

    function( query )
    {
        var el = document.createElement( query );
        document.getElementsByTagName( 'body' )[0].appendChild( el );
        var result = xµ( query ).remove();
        return result;
    }
];
var removeTestResults = testLoop( removeTest, 'removeme' );
testPresent( '.remove( ) test x ' + iterations + ' : total ' +
        removeTestResults[ 1 ], removeTestResults[ 0 ], removeTest );


/**
 *
 * .remove() test
 *
 * tests .remove() by removing the class 'moo'
 */
var removeClassTest = [

    function( query )
    {
        var result, target  = document.querySelectorAll( query );
        for ( var i = 0, lenI = target.length; i < lenI; i++ )
        {
            result  = target[ i ].classList.remove( 'moo' );
        }
        return result;
    },

    function( query )
    {
     var result = $( query ).removeClass( 'moo' );
     return result;
    },

    function( query )
    {
     var result = µ( query ).removeClass( 'moo' );
     return result;
    },

    function( query )
    {
     var result = xµ( query ).removeClass( 'moo' );
     return result;
    }
];
var removeClassTestResults = testLoop( removeClassTest, '.test1' );
testPresent( '.removeClass( ) test x ' + iterations + ' : total ' +
            removeClassTestResults[ 1 ], removeClassTestResults[ 0 ], removeClassTest );


/**
 *
 * .text() test
 *
 * tests .test() by changing the text in each of a queried list to 'test1'
 */
var textTest = [

    function( query )
    {
        var result = document.querySelectorAll( query );
        for ( var i = 0, lenI = result.length; i < lenI; i++ )
        {
            result[ i ].innerText = 'test1';
        }
        return result;
    },

    function( query )
    {
        var result = $( query ).text( 'test1' );
        $( query ).text();
        return result;
    },

    function( query )
    {
        var result = µ( query ).text( 'test1' );
        µ( query ).text();
        return result;
    },

    function( query )
    {
        var result = xµ( query ).text( 'test1' );
        xµ( query ).text();
        return result;
    }
];
var textTestResults = testLoop( textTest, '.test1' );
testPresent( '.text( ) test x ' + iterations + ' : total ' +
            textTestResults[ 1 ], textTestResults[ 0 ], textTest );


/**
 *
 * .toArray() test
 *
 * tests .toArray() by changing from a nodelist to an array
 */
var toArray = [

    function( query )
    {
        var arr = [], result = document.querySelectorAll( query );

        for( var i = 0, lenI = result.length; i < lenI; i++ )
        {
            arr.push( result[ i ] );
        }
        return arr;
    },

    function( query )
    {
        var result = $( query ).toArray();
        return result;
    },

    function( query )
    {
        var result = µ( query ).toArray();
        return result;
    },

    function( query )
    {
        var result = xµ( query ).toArray();
    }
];
var toArrayResults = testLoop( toArray, '.test1' );
testPresent( '.toArray( ) test x ' + iterations + ' : total ' +
            toArrayResults[ 1 ], toArrayResults[ 0 ], toArray );


/**
 *
 * .toggleClass() test
 *
 * tests .toggleClass() by adding and removing the class 'moo'
 */
var toggleClassTest = [

    function( query )
    {
        var result, target  = document.querySelectorAll( query );
        for ( var i = 0, lenI = target.length; i < lenI; i++ )
        {
            result  = target[ i ].classList.toggle( 'moo' );
        }
        return result;
    },

    function( query )
    {
        var target = $( query );
        var result = target.toggleClass( 'moo' );
        result = target.toggleClass( 'moo' );
        return result;
    },

    function( query )
    {
        var target = µ( query );
        var result = target.toggleClass( 'moo' );
        result = target.toggleClass( 'moo' );
        return result;
    },

    function( query )
    {           // dummy function. this didnt work in xµ
        var i = 0;
        while ( i < 50000 )
        { i++; } return true;}
];
var toggleClassTestResults = testLoop( toggleClassTest, '.test1' );
testPresent( '.toggleClass( ) test x ' + iterations + ' : total ' +
            toggleClassTestResults[ 1 ], toggleClassTestResults[ 0 ], toggleClassTest );


// unbind test later
