/*!
 * Microbe JavaScript Library v0.4.0
 * http://m.icro.be
 *
 * Copyright 2014-2015 Sociomantic Labs and other contributors
 * Released under the MIT license
 * http://m.icro.be/license
 *
 * Date: Mon Aug 24 2015
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.µ=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * ## Microbe
 *
 * Builds the Microbe object
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
 /*jshint globalstrict: true*/
'use strict';

var _type       = '[object Microbe]';
var _version    = '0.4.0';

var Microbe = function( selector, scope, elements )
{
    return new Microbe.core.__init__( selector, scope, elements );
};

Microbe.core    = Microbe.core || {};

// require( './core' )( Microbe );
require( './root' )( Microbe );
// require( './dom' )( Microbe );
// require( './http' )( Microbe );
// require( './observe' )( Microbe );
// require( './events' )( Microbe );

require( './cytoplasm/cytoplasm' )( Microbe, _type, _version );

module.exports = Microbe.core.constructor = Microbe;

},{"./cytoplasm/cytoplasm":2,"./root":5}],2:[function(require,module,exports){
/**
 * Cytoplasm.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Cytoplasm
 */
/**
 * ## exported
 *
 * @return _Function_ function that augment Cytoplasm.
 */
module.exports = function( Cytoplasm, _type, _version )
{
    'use strict';

    Cytoplasm.core.type       = Cytoplasm.type    = _type;
    Cytoplasm.core.version    = Cytoplasm.version = _version;

    var trigger, _shortSelector;

    var selectorRegex = Cytoplasm.prototype.__selectorRegex =  /(?:[\s]*\.([\w-_\.]+)|#([\w-_]+)|([^#\.:<][\w-_]*)|(<[\w-_#\.]+>)|:([^#\.<][\w-()_]*))/g;

    // TODO: Check if we hit the duck

    /**
     * ## _build
     *
     * Builds and returns the final Cytoplasm
     *
     * @param {Array} _elements array of elements
     * @param {String} _selector selector
     *
     * @return PCytoplasm_ Cytoplasm wrapped elements
     */
    function _build( _elements, self )
    {
        var i = 0, lenI = _elements.length;

        for ( ; i < lenI; i++ )
        {
            self[ i ]           = _elements[ i ];
        }

        self.length     = i;

        return self;
    }


    /**
     * ## _create
     *
     * Method creates a Cytoplasm from an element or a new element of the passed string, and
     * returns the Cytoplasm
     *
     * @param {Element} _el element to create
     *
     * @return PCytoplasm_
     */
    function _create( _el, self )
    {
        var resultsRegex    = _el.match( selectorRegex ),
            _id = '', _tag = '', _class = '';

        var i = 0, lenI = resultsRegex.length;
        for ( ; i < lenI; i++ )
        {
            var trigger = resultsRegex[ i ][ 0 ];
            switch ( trigger )
            {
                case '#':
                    _id     += resultsRegex[ i ];
                    break;

                case '.':
                    _class  += resultsRegex[ i ];
                    break;

                default:
                    _tag    += resultsRegex[ i ];
                    break;
            }
        }

        if ( typeof _tag === 'string' )
        {
            _el = document.createElement( _tag );

            if ( _id )
            {
                _el.id = _id.slice( 1 );
            }

            if ( _class )
            {
                _class = _class.split( '.' );

                for ( i = 1, lenI = _class.length; i < lenI; i++ )
                {
                    _el.classList.add( _class[ i ] );
                }
            }

        }

        return _build( [ _el ], self );
    }


    /**
     * ## _css4StringReplace
     *
     * translates css4 strings
     *
     * @param  {String} _string pre substitution string
     *
     * @param  {String} post substitution string
     */
    function _css4StringReplace( _string )
    {
        if ( _string.indexOf( '>>' ) !== -1 )
        {
            _string = _string.replace( />>/g, ' ' );
        }
        if ( _string.indexOf( '!' ) !== -1 )
        {
            _string = _string.replace( /!/g, ':parent' );
        }

        return _string;
    }


    /**
     * ## _noScopeSimple
     *
     * if ther is no scope and there is only a simple selector
     *
     * @param  {String} _s   selector string
     * @param  {Object} self this empty Cytoplasm
     *
     * @return PCytoplasm_
     */
    function _noScopeSimple( _s, self )
    {
        if ( typeof _s === 'string' && _s.indexOf( ':' ) === -1 &&
                _s.indexOf( '!' ) === -1 && _s.indexOf( ' ' ) === -1 )
        {
            switch ( _s[0] )
            {
                case '#':
                    if ( _s.indexOf( '.' ) === -1 )
                    {
                        var id = document.getElementById( _s.slice( 1 ) );

                        return id === null ? _build( [] ) : _build( [ id ], self );
                    }
                    break;
                case '.':
                    if ( _s.indexOf( '#' ) === -1 )
                    {
                        var clss = _s.slice( 1 );

                        if ( clss.indexOf( '.' ) === -1 )
                        {
                            return _build( document.getElementsByClassName( clss ), self );
                        }
                    }
                    break;
                default:
                    if ( _s && _s.indexOf( '[' ) === -1 && _s.indexOf( '<' ) === -1 &&
                            _s.indexOf( '#' ) === -1 && _s.indexOf( '.' ) === -1 )
                    {
                        return _build( document.getElementsByTagName( _s ), self );
                    }
                    break;
            }
        }

        return false;
    }


    /**
     * ## \_\_init\_\_
     *
     * Constructor.
     *
     * Either selects or creates an HTML element and wraps it into a Cytoplasm instance.
     * Usage:   µ( 'div#test' )   ---> selection
     *          µ( '<div#test>' ) ---> creation
     *
     * @param {Mixed} _selector HTML selector (Element String Array)
     * @param {Mixed} _scope scope to look inside (Element String Cytoplasm)
     * @param {Mixed} _elements elements to fill Cytoplasm with (optional) (Element or Array)
     *
     * @return PCytoplasm_
     */
    var Init = Cytoplasm.core.__init__ =  function( _selector, _scope, _elements )
    {
        var res;
        if ( !_scope )
        {
            res = _noScopeSimple( _selector, this );

            if ( res )
            {
                return res;
            }
        }

        if ( typeof _selector === 'string' )
        {
            _selector = _css4StringReplace( _selector );
        }

        if ( typeof _scope === 'string' )
        {
            _scope = _css4StringReplace( _scope );
        }

        _selector = _selector || '';

        if ( _scope && _scope.type === _type )
        {
            res = _build( [], this );

            for ( var n = 0, lenN = _scope.length; n < lenN; n++ )
            {
                res.merge( new Init( _selector, _scope[ n ] ), true );
            }

            return res;
        }

        /*
         * fast tracks element based queries
         */
        var isArr, isHTMLCollection;
        if ( _selector.nodeType === 1 || ( isArr = Array.isArray( _selector ) ) ||
            _selector === window || _selector === document ||
            ( isHTMLCollection = _selector.toString() === '[object HTMLCollection]' ) )
        {
            if ( !isArr && !isHTMLCollection )
            {
                _selector = [ _selector ];
            }

            return _build( _selector, this );
        }

        _scope = _scope === undefined ?  document : _scope;

        if ( _scope !== document )
        {
            if ( typeof _scope === 'string' && typeof _selector === 'string' )
            {
                return this.constructor( _scope ).find( _selector );
            }
        }

        var scopeNodeType   = _scope.nodeType,
            nodeType        = ( _selector ) ? _selector.nodeType || typeof _selector : null;

        if ( ( !_selector || typeof _selector !== 'string' ) ||
            ( scopeNodeType !== 1 && scopeNodeType !== 9 ) )
        {
            return _build( [], this );
        }

        var resultsRegex = _selector.match( selectorRegex );

        if ( resultsRegex && resultsRegex.length === 1 && resultsRegex[ 0 ][ 0 ] !== ':'  )
        {
            trigger         = resultsRegex[0][0];

            _shortSelector  = _selector.slice( 1 );

            switch( trigger )
            {
                case '.': // non-document scoped classname search
                    var _classesCount   = ( _selector || '' ).slice( 1 ).split( '.' ).length;

                    if ( _classesCount === 1 )
                    {
                        return _build( _scope.getElementsByClassName( _shortSelector ), this );
                    }
                    break;
                case '#': // non-document scoped id search
                    var _id = document.getElementById( _shortSelector );

                    if ( _scope.ownerDocument && this.contains( _id, _scope ) )
                    {
                        return _build( [ _id ], this );
                    }
                    else
                    {
                        return _build( [], this );
                    }
                    break;
                case '<': // element creation
                    return _create( _selector.substring( 1, _selector.length - 1 ), this );
                default:
                    return _build( _scope.getElementsByTagName( _selector ), this );
            }
        }

        if ( !( this instanceof Init ) )
        {
            return new Init( _selector, _scope, _elements );
        }

        if ( _selector.indexOf( ':' ) !== -1 && _pseudo )
        {
            return _pseudo( this, _selector, _scope, _build );
        }

        return _build( _scope.querySelectorAll( _selector ), this );
    };


    Cytoplasm.core.__init__.prototype = Cytoplasm.core;


    require( './cytoplasm.utils' )( Cytoplasm );
    require( './cytoplasm.pseudo' )( Cytoplasm );

    var _pseudo = Cytoplasm.constructor.pseudo;
};

},{"./cytoplasm.pseudo":3,"./cytoplasm.utils":4}],3:[function(require,module,exports){
/**
 * pseudo.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Cytoplasm
 */

/**
 * ## exported
 *
 * @return _Function_ function that augment Cytoplasm.
 */
module.exports = function( Cytoplasm )
{
    'use strict';

    /**
     * ### parseNth
     *
     * when supplied with a Cytoplasm and a css style n selector (2n1), filters
     * and returns the result
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var number string
     * @param {Boolean} _last counting from the font or back
     *
     * @return _Cytoplasm_
     */
    var parseNth = function( _el, _var, _last )
    {
        if ( _var === 'odd' )
        {
            _var = '2n';
        }
        else if ( _var === 'even' )
        {
            _var = '2n1';
        }

        if ( _var.indexOf( 'n' ) === -1 )
        {
            switch ( _last )
            {
                case true:
                case 'last':
                    return new Cytoplasm( _el[ _el.length - parseInt( _var ) ] );
            }
            return new Cytoplasm( _el[ parseInt( _var ) - 1 ] );
        }
        else
        {
            _var            = _var.split( 'n' );
            var increment   = parseInt( _var[0] ) || 1;
            var offset      = parseInt( _var[1] );

            var top;
            if ( _last === true || _last === 'last' )
            {
                top         = _el.length - parseInt( _var[1] );
                offset      = top % increment;
            }

            var _e, resArray = [];
            for ( var i = offset || 0, lenI = top || _el.length; i < lenI; )
            {
                _e = _el[ i ];

                if ( _e )
                {
                    resArray.push( _e );
                }

                i += increment;
            }
            return new Cytoplasm( resArray );
        }
    };


    /**
     * ### pseudo
     *
     * an extension to core.__init_ to handle custom pseusoselectors
     *
     * @param  {Cytoplasm} self half built Cytoplasm
     * @param  {String} selector pseudo-selector string
     * @param  {Object} _scope scope element
     * @param  {Function} _build build function from core
     *
     * @return _Cytoplasm_
     */
    var pseudo = function( self, selector, _scope, _build )
    {
        /**
         * ## _breakUpSelector
         *
         * pushes each selector through the pseudo-selector engine
         *
         * @param  {Array} _selectors split selectors
         *
         * @return _Cytoplasm_
         */
        function _breakUpSelector( _selectors )
        {
            var _el, resArray = [];
            for ( var i = 0, lenI = _selectors.length; i < lenI; i++ )
            {
                if ( i === 0 )
                {
                    resArray = pseudo( self, _selectors[ i ], _scope, _build );
                }
                else
                {
                    Cytoplasm.merge( resArray, pseudo( self, _selectors[ i ], _scope, _build ), true );
                }
            }

            return resArray;
        }


        /**
         * ## _buildObject
         *
         * builds the Cytoplasm ready for return
         *
         * @return _Cytoplasm_
         */
        function _buildObject()
        {
            var _pseudo = _parsePseudo( _selector );

            var obj = _build( _scope.querySelectorAll( _pseudo[0] ), self );
            _pseudo = _pseudo[ 1 ];

            var _sel, _var;
            for ( var h = 0, lenH = _pseudo.length; h < lenH; h++ )
            {
                _sel = _pseudo[ h ].split( '(' );
                _var = _sel[ 1 ];
                if ( _var )
                {
                    _var = _var.slice( 0, _var.length - 1 );
                }
                _sel = _sel[ 0 ];

                if ( Cytoplasm.constructor.pseudo[ _sel ] )
                {
                    obj = Cytoplasm.constructor.pseudo[ _sel ]( obj, _var, selector );
                }
            }

            return obj;
        }


        /**
         * ## _cycleFilters
         *
         * filters multiple pseudo-selector selectors
         *
         * @param {Array} res array of results to be filtered
         *
         * @return _Cytoplasm_
         */
        function _cycleFilters( res )
        {
            var obj = Cytoplasm.constructor.pseudo( self, res[ 0 ], _scope, _build );

            var filter, connect = false;
            for ( var i = 1, lenI = res.length; i < lenI; i++ )
            {
                filter = res[ i ].trim();

                if ( filter[ 0 ] === '~' )
                {
                    obj = obj.siblingsFlat();
                    connect = true;
                }
                else if ( filter[ 0 ] === '>' )
                {
                    obj = obj.childrenFlat();
                    connect = true;
                }
                else if ( filter[ 0 ] === '+' )
                {
                    obj = obj.siblingsFlat( 'next' );
                    connect = true;
                }
                else if ( connect )
                {
                    obj = obj.filter( filter );
                    connect = false;
                }
                else
                {
                    obj = obj.find( filter );
                    connect = false;
                }

                if ( obj.length === 0 )
                {
                    return obj;
                }
            }
            return obj;
        }


        /**
         * ## _parsePseudo
         *
         * checks all pseudo-selectors to see if they're custom and
         * otherwise it reattaches it
         *
         * @param  {String} _sel selector string
         *
         * @return _String_ modified selector
         */
        function _parsePseudo( _sel )
        {
            var _pseudoArray;
            var _pseudo = _sel.split( ':' );
            _sel        = _pseudo[ 0 ];
            _pseudo.splice( 0, 1 );

            for ( var k = 0, lenK = _pseudo.length; k < lenK; k++ )
            {
                _pseudoArray = _pseudo[ k ].split( '(' );

                if ( !Cytoplasm.constructor.pseudo[ _pseudoArray[ 0 ] ] )
                {
                    _sel += ':' + _pseudo[ k ];
                    _pseudo.splice( k, 1 );
                }
            }

            return [ _sel, _pseudo ];
        }



        if ( selector.indexOf( ',' ) !== -1 )
        {
            selector = selector.split( /,(?![a-zA-Z0-9-#.,\s]+\))/g );

            if ( selector.length > 1 )
            {
                return _breakUpSelector( selector );
            }
            else
            {
                selector = selector[ 0 ];
            }
        }

        var _selector = selector;

        if ( _selector[ 0 ] === ':' )
        {
            _selector = '*' + _selector;
        }

        if ( _selector.trim().indexOf( ' ' ) !== -1 )
        {
            var filterFunction = function( e ){ return e === ' ' ? false : e; };
            var res = _selector.split( /((?:[A-Za-z0-9.#*\-_]+)?(?:\:[A-Za-z\-]+(?:\([\s\S]+\))?)?)?( )?/ );
                res = res.filter( filterFunction );

            if ( res.length > 1 )
            {
                return _cycleFilters( res );
            }
            else
            {
                _selector = res[ 0 ];
            }
        }

        return _buildObject();
    };


    /**
     * ### any-link
     *
     * match elements that act as the source anchors of hyperlinks
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo[ 'any-link' ] = function( _el )
    {
        return _el.filter( 'a' );
    };


    /**
     * ### blank
     *
     * matches elements that only contain content which consists of whitespace
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo.blank = function( _el )
    {
        var resArray = [], _e, _t;
        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            _e = _el[ i ];
            _t = document.all ? _e.innerText : _e.textContent;

            if ( resArray.indexOf( _e ) === -1 )
            {
                if ( /^\s*$/.test( _t || _e.value ) )
                {
                    resArray.push( _e );
                }
            }
        }

        return _el.constructor( resArray );
    };


    /**
     * ### column
     *
     * filters for columns with a suplied selector
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var string to search for
     *
     * @return _Cytoplasm_
     */
    pseudo.column = function( _el, _var )
    {
        return _el.filter( 'col' ).filter( _var );
    };


    /**
     * ### contains
     *
     * Returns only elements that contain the given text.  The supplied text
     * is compared ignoring case
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var string to search for
     *
     * @return _Cytoplasm_
     */
    pseudo.contains = function( _el, _var )
    {
        _var            = _var.toLowerCase();

        var _getText = function( _el )
        {
            if ( document.all )
            {
                return _el.innerText;
            }
            else // FF
            {
                return _el.textContent;
            }
        };

        var _e, _elText, elements    = [];

        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            _e      = _el[ i ];
            _elText = _getText( _e );

            if ( _elText.toLowerCase().indexOf( _var ) !== -1 )
            {
                elements.push( _e );
            }
        }
        return _el.constructor( elements );
    };


    /**
     * ### default
     *
     * selects all inputs and select boxes that are checked by dafeult
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo.default = function( _el )
    {
        _el = _el.filter( 'input, option' );

        var _e, resArray = [];
        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            _e = _el[ i ];

            if ( _e.defaultChecked === true )
            {
                resArray.push( _e );
            }
        }

        return _el.constructor( resArray );
    };


    /**
     * ### dir
     *
     * match elements by its directionality based on the document language
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var string to search for
     *
     * @return _Cytoplasm_
     */
    pseudo.dir = function( _el, _var )
    {
        var _e, resArray = [];
        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            _e = _el[ i ];
            if ( getComputedStyle( _e ).direction === _var )
            {
                resArray.push( _e );
            }
        }
        return _el.constructor( resArray );
    };


    /**
     * ### drop
     *
     * returns all elements that are drop targets. HTML has a dropzone
     * attribute which specifies that an element is a drop target.
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var trigger string
     *
     * @return _Cytoplasm_
     */
    pseudo.drop = function( _el, _var )
    {
        _el = _el.filter( '[dropzone]' );

        if ( !_var )
        {
            return _el;
        }
        else
        {
            switch ( _var )
            {
                case 'active':
                    return _el.filter( ':active' );
                case 'invalid':
                    return _el.filter();
                case 'valid':
                    return _el.filter();
            }
        }
    };


    /**
     * ### even
     *
     * Returns the even indexed elements of a Cytoplasm (starting at 0)
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo.even = function( _el )
    {
        var elements = [];
        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            if ( ( i + 1 ) % 2 === 0 )
            {
                elements.push( _el[ i ] );
            }
        }
        return _el.constructor( elements );
    };


    /**
     * ### first
     *
     * returns the first element of a Cytoplasm
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo.first = function( _el )
    {
        return _el.first();
    };


    /**
     * ### gt
     *
     * returns the last {_var} element
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var number of elements to return
     *
     * @return _Cytoplasm_
     */
    pseudo.gt = function( _el, _var )
    {
        return _el.splice( _var, _el.length );
    };


    /**
     * ### has
     *
     * returns elements that have the passed selector as a child
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var selector string
     *
     * @return _Cytoplasm_
     */
    pseudo.has = function( _el, _var )
    {
        var i, lenI, _obj, results = [], _e;

        for ( i = 0, lenI = _el.length; i < lenI; i++ )
        {
            _e      = _el[ i ];
            _obj    = _e.querySelector( _var );
            if ( _obj )
            {
                results.push( _e );
            }
        }

        return _el.constructor( results );
    };


    /**
     * ### in-range
     *
     * select the elements with a value inside the specified range
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo[ 'in-range' ] = function( _el )
    {
        _el = _el.filter( '[max],[min]' );

        var min, max, _v, _e, resArray = [];
        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            _e = _el[ i ];
            min = _e.getAttribute( 'min' );
            max = _e.getAttribute( 'max' );
            _v = parseInt( _e.value );

            if ( _v )
            {
                if ( min && max )
                {
                    if ( _v > min && _v < max )
                    {
                        resArray.push( _e );
                    }
                }
                else if ( min && _v > min )
                {
                    resArray.push( _e );
                }
                else if ( max && _v < max )
                {
                    resArray.push( _e );
                }
            }
        }
        return _el.constructor( resArray );
    };


    /**
     * ### lang
     *
     * match the elements based on the document language
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var specified language (accepts wildcards as *)
     *
     * @return _Cytoplasm_
     */
    pseudo.lang = function( _el, _var )
    {
        if ( _var )
        {
            if ( _var.indexOf( '*' ) !== -1 )
            {
                _el     = _el.filter( '[lang]' );
                _var    = _var.replace( '*', '' );
                var resArray = [], _e;
                for ( var i = 0; i < _el.length; i++ )
                {
                    _e = _el[ i ];
                    if ( _e.getAttribute( 'lang' ).indexOf( _var ) !== -1 )
                    {
                        resArray.push( _e );
                    }
                }

                return new Cytoplasm( resArray );
            }

            var res = document.querySelectorAll( ':lang(' + _var + ')' );
                res = Array.prototype.slice.call( res, 0 );
            return new Cytoplasm( res );
        }
        else
        {
            return new Cytoplasm( [] );
        }
    };


    /**
     * ### last
     *
     * returns the last element of a Cytoplasm
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo.last = function( _el )
    {
        return _el.last();
    };



    /**
     * ### local-link
     *
     * returns all link tags that go to local links. If specified a depth
     * filter can be added
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var specified depth
     *
     * @return _Cytoplasm_
     */
    pseudo[ 'local-link' ] = function( _el, _var )
    {
        var links   = document.getElementsByTagName( 'A' );
        var here    = document.location;

        var url, urlShort, depth, resArray = [];
        for ( var i = 0, lenI = links.length; i < lenI; i++ )
        {
            url         = links[ i ].href;
            urlShort    = url.replace( here.origin, '' ).replace( here.host, '' );
            urlShort    = urlShort[ 0 ] === '/' ? urlShort.slice( 1 ) : urlShort;
            depth       = urlShort.split( '/' ).length - 1;

            if ( !_var || parseInt( _var ) === depth )
            {
                resArray.push( links[ i ] );
            }
        }

        return _el.constructor( resArray );
    };


    /**
     * ### lt
     *
     * returns the first [_var] elements
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var number of elements to return
     *
     * @return _Cytoplasm_
     */
    pseudo.lt = function( _el, _var )
    {
        return _el.splice( 0, _var );
    };


    /**
     * ### matches
     *
     * returns elements that match either selector
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var selector filter
     * @param {String} _selector full original selector
     *
     * @return _Cytoplasm_
     */
    pseudo.matches = function( _el, _var, _selector )
    {
        var text = ':matches(' + _var + ')';
        _var = _var.split( ',' );

        _selector = _selector.replace(  text, '' );
        _selector = _selector === '*' ? '' : _selector;

        var res = new Cytoplasm( _selector + _var[ 0 ].trim() );

        for ( var i = 1, lenI = _var.length; i < lenI; i++ )
        {
            res.merge( new Cytoplasm( _selector + _var[ i ].trim() ), true );
        }

        return res;
    };


    /**
     * ### not
     *
     * returns all elements that do not match the given selector. As per
     * CSS4 spec, this accepts complex selectors seperated with a comma
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var null selector
     * @param {String} _recursive an indicator that it is calling itself. defines output
     *
     * @return _Cytoplasm_
     */
    pseudo.not = function( _el, _var, _selector, _recursive )
    {
        if ( _var.indexOf( ',' ) !== -1 )
        {
            _var = _var.split( ',' );

            for ( var i = 0, lenI = _var.length; i < lenI; i++ )
            {
                _el = this.not( _el, _var[ i ].trim(), _selector, true );
            }

            return new Cytoplasm( _el );
        }
        else
        {
            var resArray = [];
            for ( var j = 0, lenJ = _el.length; j < lenJ; j++ )
            {
                if ( ! Cytoplasm.matches( _el[ j ], _var ) )
                {
                    resArray.push( _el[ j ] );
                }
            }

            if ( _recursive )
            {
                return resArray;
            }
            return _el.constructor( resArray );
        }
    };


    /**
     * ### nth-column
     *
     * returns the nth column of the current Cytoplasm
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var column number(s) return
     *
     * @return _Cytoplasm_
     */
    pseudo[ 'nth-column' ] = function( _el, _var )
    {
        _el = _el.filter( 'col' );

        return parseNth( _el, _var );
    };


    /**
     * ### nth-last-column
     *
     * returns the nth column of the current Cytoplasm starting from the back
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var column number(s) return
     *
     * @return _Cytoplasm_
     */
    pseudo[ 'nth-last-column' ] = function( _el, _var )
    {
        _el = _el.filter( 'col' );

        return parseNth( _el, _var, true );
    };


    /**
     * ### nth-last-match
     *
     * returns the nth match(es) of the current Cytoplasm starting from the back
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var match number(s) return
     *
     * @return _Cytoplasm_
     */
    pseudo[ 'nth-last-match' ] = function( _el, _var )
    {
        return parseNth( _el, _var, true );
    };


    /**
     * ### nth-match
     *
     * returns the nth match(es) of the current Cytoplasm
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     * @param {String} _var match number(s) return
     *
     * @return _Cytoplasm_
     */
    pseudo[ 'nth-match' ] = function( _el, _var )
    {
        return parseNth( _el, _var );
    };


    /**
     * ### add
     *
     * returns the odd indexed elements of a Cytoplasm
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo.odd = function( _el )
    {
        var elements = [];
        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            if ( ( i + 1 ) % 2 !== 0 )
            {
                elements.push( _el[ i ] );
            }
        }
        return _el.constructor( elements );
    };


    /**
     * ### optional
     *
     * returns all optional elements
     *
     * @param  {[Cytoplasm} _el base elements set
     *
     * @return _Cytoplasm_
     */
    pseudo.optional = function( _el )
    {
        return _el.filter( 'input:not([required=required]), textfield:not([required=required]), [required=optional], [optional]' );
    };


    /**
     * ### out-of-range
     *
     * select the elements with a value inside the specified range
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo[ 'out-of-range' ] = function( _el )
    {
        _el = _el.filter( '[max],[min]' );

        var min, max, _v, _e, resArray = [];
        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            _e  = _el[ i ];
            min = _e.getAttribute( 'min' );
            max = _e.getAttribute( 'max' );
            _v  = parseFloat( _e.value );

            if ( _v )
            {
                if ( min && max )
                {
                    if ( _v < min || _v > max )
                    {
                        resArray.push( _e );
                    }
                }
                else if ( min && _v < min )
                {
                    resArray.push( _e );
                }
                else if ( max && _v > max )
                {
                    resArray.push( _e );
                }
            }
        }

        return _el.constructor( resArray );
    };


    /**
     * ### parent
     *
     * returns the parents of an _el match.
     * normally triggered using the ! selector
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo.parent = function( _el )
    {
        _el =  _el.parent();

        var _e, elements = [];
        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            _e = _el[ i ];

            if ( elements.indexOf( _e ) === -1 )
            {
                elements.push( _e );
            }
        }

        return _el.constructor( elements );
    };


    /**
     * ### read-only
     *
     * user-non-alterable content
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo[ 'read-only' ] = function( _el )
    {
        return _el.filter( ':not(input,textfield,[contenteditable=false])' );
    };


    /**
     * ### read-write
     *
     * input elements which are user-alterable or contenteditable
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo[ 'read-write' ] = function( _el )
    {
        return _el.filter( 'input,textfield,[contenteditable=true]' );
    };


    /**
     * ### required
     *
     * returns all required elements
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo.required = function( _el )
    {
        return _el.filter( '[required=required]' );
    };


    /**
     * ### root
     *
     * returns the root elements of the document
     *
     * @param {Cytoplasm} _el Cytoplasm to be filtered
     *
     * @return _Cytoplasm_
     */
    pseudo.root = function( _el )
    {
        return _el.constructor( document.body.parentNode );
    };



    Cytoplasm.constructor.prototype.pseudo = pseudo;
};


},{}],4:[function(require,module,exports){
/**
 * pseudo.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
var splice      = Array.prototype.splice;
/**
 * ## exported
 *
 * @return _Function_ function that augment Microbe.
 */
module.exports = function( Cytoplasm )
{
    'use strict';
    /**
     * ## _contains
     *
     * Checks if a given element is a child of _scope
     *
     * @param {Element} _el element to check
     * @param {Element} _scope scope
     *
     * @return _Boolean_ whether _el is contained in the scope
     */
    Cytoplasm.contains = function( _el, _scope )
    {
        var parent = _el.parentNode;

        while ( parent !== document && parent !== _scope )
        {
            parent = parent.parentNode || _scope.parentNode;
        }

        if ( parent === document )
        {
            return false;
        }

        return true;
    };


    /**
     * ## matches
     *
     * checks element an to see if they match a given css selector
     * unsure if we actually need the webkitMatchSelector and mozMatchSelector
     * http://caniuse.com/#feat=matchesselector
     *
     * @param  {Mixed} el element, microbe, or array of elements to match
     *
     * @return _Booblean matches or not
     */
    Cytoplasm.matches = function( el, selector )
    {
        var method = this.matches.__matchesMethod;
        var notForm = ( typeof el !== 'string' && !!( el.length ) &&
                        el.toString() !== '[object HTMLFormElement]' );

        var isArray = Array.isArray( el ) || notForm ? true : false;

        if ( !isArray && !notForm )
        {
            el = [ el ];
        }

        if ( !method && el[ 0 ] )
        {
            if ( el[ 0 ].matches )
            {
                method = this.matches.__matchesMethod = 'matches';
            }
            else if ( el[ 0 ].msMatchSelector )
            {
                method = this.matches.__matchesMethod = 'msMatchSelector';
            }
            else if ( el[ 0 ].mozMatchSelector )
            {
                method = this.matches.__matchesMethod = 'mozMatchSelector';
            }
            else if ( el[ 0 ].webkitMatchSelector )
            {
                method = this.matches.__matchesMethod = 'webkitMatchSelector';
            }
        }

        var resArray = [];
        for ( var i = 0, lenI = el.length; i < lenI; i++ )
        {
            resArray.push( el[ i ][ method ]( selector ) );
        }

        return isArray ? resArray : resArray[ 0 ];
    };


    /**
     * ## filter
     *
     * Filters the microbe by the given given selector or function.  In the case
     * of a function, the element is passed as this. The inclusion on an element
     * into the set is based on the return of the function
     *
     * @param {Mixed} selector selector or function to filter by
     *
     * @return _Microbe_ new microbe containing only the filtered values
     */
    Cytoplasm.core.filter = function( filter )
    {
        var pseudo, filters, self = this, _el, method;

        if ( this.length === 0 )
        {
            return this;
        }

        if ( typeof filter === 'function' )
        {
            var res = [];

            for ( var i = 0, lenI = this.length; i < lenI; i++ )
            {
                if ( filter.call( this[ i ], i ) )
                {
                    res.push( this[ i ] );
                }
            }
            return this.constructor( res );
        }
        else
        {
            var _filter = function( _f, _self, i )
            {
                if ( Cytoplasm.pseudo[ _f[ 0 ] ] )
                {
                    return Cytoplasm.pseudo[ _f[ 0 ] ]( _self, _f[ 1 ] );
                }
                else
                {
                    var resArray = [], _selector;
                    _selector = i === 0 ? _f[ 0 ] : ':' + _f[ 0 ];

                    if ( _selector !== '' )
                    {
                        if ( _f[ 1 ] !== '' )
                        {
                            _selector += '(' + _f[ 1 ] + ')';
                        }

                        for ( var j = 0, lenJ = _self.length; j < lenJ; j++ )
                        {
                            _el = _self[ j ];

                            if ( Cytoplasm.matches( _el, _selector ) === true )
                            {
                                resArray.push( _el );
                            }
                        }
                    }

                    return new Cytoplasm( resArray );
                }
            };

            if ( filter && filter.indexOf( ':' ) !== -1 )
            {
                pseudo  = filter.split( ':' );
                filters = [ [ pseudo.splice( 0, 1 ).toString(), '' ] ];

                var _p, pseudoArray;

                for ( var h = 0, lenH = pseudo.length; h < lenH; h++ )
                {
                    _p = pseudo[ h ];

                    if ( _p.indexOf( '(' ) !== - 1 )
                    {
                        _p      = _p.split( '(' );
                        _p[ 1 ] = _p[ 1 ].replace( ')', '' );
                    }
                    else
                    {
                        _p      = [ _p, '' ];
                    }

                    filters.push( _p );
                }
            }
            else if ( filter )
            {
                filters = [ [ filter, '' ] ];
            }
            else
            {
                return this;
            }

            for ( var k = 0, lenK = filters.length; k < lenK; k++ )
            {
                if ( self.length !== 0 )
                {
                    if ( filters[ k ][ 0 ] !== '' )
                    {
                        self = _filter( filters[ k ], self, k );
                    }
                }
                else
                {
                    return self;
                }
            }

            return self;
        }
    };


    /**
     * ## find
     *
     * Finds a child element with the given selector inside the scope of the current microbe
     *
     * @param {String} selector            selector to search for
     *
     * @return _Microbe_ new microbe containing only the found children values
     */
    Cytoplasm.core.find = function( _selector )
    {
        var _s          = _selector[ 0 ];

        if ( _s === ' ' )
        {
            _selector   = _selector.trim();
            _s          = _selector[ 0 ];
        }

        if ( _s === '>' )
        {
            _selector = _selector.slice( 1 );
            return this.childrenFlat().filter( _selector );
        }
        else if ( _s === '~' )
        {
            _selector = _selector.slice( 1 );
            return this.siblingsFlat().filter( _selector );
        }
        else if ( _s === '!' )
        {
            return this.parent();
        }
        else if ( _s === '+' )
        {
            _selector       = _selector.slice( 1 );
            var resArray    = [],
                _el, els    = this.children();

            for ( var i = 0, lenI = els.length; i < lenI; i++ )
            {
                _el = els[ i ][ 0 ];

                if ( _el )
                {
                    resArray.push( _el );
                }
            }

            return new Cytoplasm( resArray ).filter( _selector );
        }
        else if ( _selector.indexOf( ':' ) !== -1 )
        {
            return this.constructor( _selector, this );
        }

        var _children = new Cytoplasm( _selector ), res = [];

        for ( var j = 0, lenJ = this.length; j < lenJ; j++ )
        {
            for ( var k = 0, lenK = _children.length; k < lenK; k++ )
            {
                if ( Cytoplasm.contains( _children[ k ], this[ j ] ) )
                {
                    res.push( _children[ k ] );
                }
            }
        }

        return this.constructor( res );
    };


    /**
     * ## first
     *
     * gets the first Element of the current microbe, and wraps it in
     * Microbe.
     *
     * @return _Microbe_ new microbe containing only the first value
     */
    Cytoplasm.core.first = function()
    {
        if ( this.length !== 0 )
        {
            return this.constructor( this[ 0 ] );
        }

        return this.constructor( [] );
    };


    /**
     * ## last
     *
     * Gets the last Element of the current microbe, and wrap it in
     * Microbe.
     *
     * @return _Microbe_ new microbe containing only the last value
     */
    Cytoplasm.core.last = function()
    {
        if ( this.length === 1 )
        {
            return this;
        }
        else if ( this.length !== 0 )
        {
            return this.constructor( this[ this.length - 1 ] );
        }

        return this.constructor( [] );
    };


    /**
     * ## Parent
     *
     * gets all elements in a microbe's parent nodes
     *
     * @return _Microbe_ new microbe containing parent elements (index-preserved)
     */
    Cytoplasm.core.parent = function()
    {
        var _parent = function( _elm )
        {
            return _elm.parentNode;
        };

        var i, len, parentArray = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            parentArray[ i ] = _parent( this[ i ] );
        }

        return new Cytoplasm( parentArray );
    };


    /**
     * ## splice
     *
     * Native splice wrapped in a microbe
     *
     * @return _Microbe_ new microbe of the remaining elements
     */
    Cytoplasm.core.splice = function( _start, _end )
    {
        var arr = splice.call( this, _start, _end );

        return this.constructor( arr );
    };
};
},{}],5:[function(require,module,exports){
/**
 * root.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

/**
 * ## exported
 *
 * @return _Function_ function that augment Microbe.
 */
module.exports = function( Microbe )
{
    'use strict';

    var Types       = require( './utils/types' );

    /**
     * ## capitalize
     *
     * capitalizes every word in a string or an array of strings and returns the
     * type that it was given
     *
     * @param {Mixed} text string(s) to capitalize _{String or Array}_
     *
     * @return _Mixed_  capitalized string(s) values _{String or Array}_
     */
    Microbe.capitalize = function( text )
    {
        var array   = Microbe.isArray( text );
        text        = !array ? [ text ] : text;

        var str, res = [];

        for ( var i = 0, lenI = text.length; i < lenI; i++ )
        {
            str = text[ i ].split( ' ' );
            for ( var j = 0, lenJ = str.length; j < lenJ; j++ )
            {
                str[ j ] = str[ j ][ 0 ].toUpperCase() + str[ j ].slice( 1 );
            }
            res.push( str.join( ' ' ) );
        }

        return ( array ) ? res : res[ 0 ];
    };


    // british people....
    Microbe.capitalise = Microbe.capitalize;


    /**
     * ## debounce
     *
     *  Returns a function, that, as long as it continues to be invoked, will not
     *  be triggered. The function will be called after it stops being called for
     *  [[wait]] milliseconds. If `immediate` is passed, trigger the function on
     *  the leading edge, instead of the trailing.
     *
     * @param {Function} _func function to meter
     * @param {Number} wait milliseconds to wait
     * @param {Boolean} immediate run function at the start of the timeout
     *
     * @return _Function_
     */
    Microbe.debounce = function( _func, wait, immediate )
    {
        var timeout;

        return function()
        {
            var context = this,
                args    = arguments;

            var later   = function()
            {
                timeout = null;

                if ( !immediate )
                {
                    _func.apply( context, args );
                }
            };

            var callNow = immediate && !timeout;
            clearTimeout( timeout );
            timeout     = setTimeout( later, wait );

            if ( callNow )
            {
                _func.apply( context, args );
            }
        };
    };


    Microbe.extend = Microbe.core.extend;


    /**
     * ## identity
     *
     * returns itself.  useful in functional programmnig when a function must be executed
     *
     * @param {any} value any value
     *
     * @return _any_
     */
    Microbe.identity = function( value ) { return value; };


    /**
     * ## insertStyle
     *
     * builds a style tag for the given selector/ media query.  Reference to the style
     * tag and object is saved in µ.__customCSSRules[ selector ][ media ].
     * next rule with the same selector combines the old and new rules and overwrites
     * the contents
     *
     * @param {String} selector selector to apply it to
     * @param {Mixed} cssObj css object. _{String or Object}_
     * @param {String} media media query
     *
     * @return _Object_ reference to the appropriate style object
     */
    Microbe.insertStyle = function( selector, cssObj, media )
    {
        var _s      = selector.replace( / /g, '-' );
        var _clss   = media ? _s +  media.replace( /[\s:\/\[\]\(\)]+/g, '-' ) : _s;

        media       = media || 'none';

        var createStyleTag = function()
        {
            var el = document.createElement( 'style' );
            el.className = 'microbe--inserted--style__' + _clss;

            if ( media && media !== 'none' )
            {
                el.setAttribute( 'media', media );
            }

            document.head.appendChild( el );

            return el;
        };

        var _el, prop;
        var styleObj =  Microbe.__customCSSRules[ _s ];

        if ( styleObj && styleObj[ media ] )
        {
            _el     = styleObj[ media ].el;
            var obj = styleObj[ media ].obj;

            for ( prop in cssObj )
            {
                obj[ prop ] = cssObj[ prop ];
            }

            cssObj = obj;
        }
        else
        {
            _el = createStyleTag();
        }

        var css = selector + '{';
        for ( prop in cssObj )
        {
            css += prop + ' : ' + cssObj[ prop ] + ';';
        }
        css += '}';

        _el.innerHTML = css;

        Microbe.__customCSSRules[ _s ] = Microbe.__customCSSRules[ _s ] || {};
        Microbe.__customCSSRules[ _s ][ media ] = { el: _el, obj: cssObj };

        return _el;
    };

    // keep track of tags created with insertStyle
    Microbe.__customCSSRules = {};


    /**
     * ## isArray
     *
     * native isArray for completeness
     *
     * @type _Function_
     */
    Microbe.isArray = Array.isArray;


    /**
     * ## isEmpty
     *
     * Checks if the passed object is empty
     *
     * @param {Object} obj object to check
     *
     * @return _Boolean_ empty or not
     */
    Microbe.isEmpty = function( obj )
    {
        var name;
        for ( name in obj )
        {
            return false;
        }

        return true;
    };


    /**
     * ## isFunction
     *
     * Checks if the passed parameter is a function
     *
     * @param {Object} obj object to check
     *
     * @return _Boolean_ function or not
     */
    Microbe.isFunction = function( obj )
    {
        return Microbe.type( obj ) === "function";
    };


    /**
     * ## isObject
     *
     * Checks if the passed parameter is an object
     *
     * @param {Object} obj object to check
     *
     * @return _Boolean_ isObject or not
     */
    Microbe.isObject = function( obj )
    {
        if ( Microbe.type( obj ) !== "object" || obj.nodeType || Microbe.isWindow( obj ) )
        {
            return false;
        }

        return true;
    };


    /**
     * ## isUndefined
     *
     * Checks if the passed parameter is undefined
     *
     * @param {String} obj property
     * @param {Object} parent object to check
     *
     * @return _Boolean_ obj in parent
     */
    Microbe.isUndefined = function( obj, parent )
    {
        if ( parent && typeof parent !== 'object' )
        {
            return true;
        }

        return parent ? !( obj in parent ) : obj === void 0;
    };


    /**
     * ## isWindow
     *
     * Checks if the passed parameter equals window
     *
     * @param {Object} obj object to check
     *
     * @return _Boolean_ isWindow or not
     */
    Microbe.isWindow = function( obj )
    {
        return obj !== null && obj === obj.window;
    };


    Microbe.merge = Microbe.core.merge;


    /**
     * ## matches
     *
     * checks element an to see if they match a given css selector
     * unsure if we actually need the webkitMatchSelector and mozMatchSelector
     * http://caniuse.com/#feat=matchesselector
     *
     * @param  {Mixed} el element, microbe, or array of elements to match
     *
     * @return _Booblean matches or not
     */
    Microbe.matches = function( el, selector )
    {
        var method = this.matches.__matchesMethod;
        var notForm = ( typeof el !== 'string' && !!( el.length ) &&
                        el.toString() !== '[object HTMLFormElement]' );

        var isArray = Microbe.isArray( el ) || notForm ? true : false;

        if ( !isArray && !notForm )
        {
            el = [ el ];
        }

        if ( !method && el[ 0 ] )
        {
            if ( el[ 0 ].matches )
            {
                method = this.matches.__matchesMethod = 'matches';
            }
            else if ( el[ 0 ].msMatchSelector )
            {
                method = this.matches.__matchesMethod = 'msMatchSelector';
            }
            else if ( el[ 0 ].mozMatchSelector )
            {
                method = this.matches.__matchesMethod = 'mozMatchSelector';
            }
            else if ( el[ 0 ].webkitMatchSelector )
            {
                method = this.matches.__matchesMethod = 'webkitMatchSelector';
            }
        }

        var resArray = [];
        for ( var i = 0, lenI = el.length; i < lenI; i++ )
        {
            resArray.push( el[ i ][ method ]( selector ) );
        }

        return isArray ? resArray : resArray[ 0 ];
    };


    /**
     * ## noop
     *
     * Nothing happens
     *
     * https://en.wikipedia.org/wiki/Xyzzy_(computing)
     *
     * @return _void_
     */
    Microbe.noop = function() {};


    /**
     * ## once
     *
     * returns a function that can only be run once
     *
     * @param {Function} _func function to run once
     *
     * @return _Function_
     */
    Microbe.once = function( _func, context )
    {
        var result;

        return function()
        {
            if( _func )
            {
                result  = _func.apply( context || this, arguments );
                _func   = null;
            }

            return result;
        };
    };


    /**
     * ## poll
     *
     * checks a passed function for true every [[interval]] milliseconds.  when
     * true, it will run _success, if [[timeout[[]] is reached without a success,
     * _error is excecuted
     *
     * @param {Function} _func function to check for true
     * @param {Function} _success function to run on success
     * @param {Function} _error function to run on error
     * @param {Number} timeout time (in ms) to stop polling
     * @param {Number} interval time (in ms) in between polling
     *
     * @return _Function_
     */
    Microbe.poll = function( _func, _success, _error, timeout, interval )
    {
        var endTime = Number( new Date() ) + ( timeout || 2000 );
        interval    = interval || 100;

        ( function p()
        {
            if ( _func() )
            {
                try
                {
                    _success();
                }
                catch( e )
                {
                    throw 'No argument given for success function';
                }
            }
            else if ( Number( new Date() ) < endTime )
            {
                setTimeout( p, interval );
            }
            else {
                try
                {
                    _error( new Error( 'timed out for ' + _func + ': ' + arguments ) );
                }
                catch( e )
                {
                    throw 'No argument given for error function.';
                }
            }
        } )();
    };


    /**
     * ## removeStyle
     *
     * removes a microbe added style tag for the given selector/ media query. If the
     * properties array is passed, rules are removed individually.  If properties is
     * set to true, all tags for this selector are removed.  The media query can
     * also be passed as the second variable
     *
     * @param {String} selector selector to apply it to
     * @param {Mixed} properties css properties to remove
     *                                                  'all' to remove all selector tags
     *                                                  string as media query {String or Array}
     * @param {String} media media query
     *
     * @return _Boolean_ removed or not
     */
    Microbe.removeStyle = function( selector, properties, media )
    {
        if ( !media && typeof properties === 'string' && properties !== 'all' )
        {
            media = properties;
            properties = null;
        }

        media = media || 'none';

        var _removeStyle = function( _el, _media )
        {
            _el.parentNode.removeChild( _el );
            delete Microbe.__customCSSRules[ selector ][ _media ];
        };

        var style = Microbe.__customCSSRules[ selector ];

        if ( style )
        {
            if ( properties === 'all' )
            {
                for ( var _mq in style )
                {
                    _removeStyle( style[ _mq ].el, _mq );
                }
            }
            else
            {
                style = style[ media ];

                if ( style )
                {
                    if ( Microbe.isArray( properties ) && !Microbe.isEmpty( properties ) )
                    {
                        for ( var i = 0, lenI = properties.length; i < lenI; i++ )
                        {
                            if ( style.obj[ properties[ i ] ] )
                            {
                                delete style.obj[ properties[ i ] ];
                            }
                        }
                        if ( Microbe.isEmpty( style.obj ) )
                        {
                            _removeStyle( style.el, media );
                        }
                        else
                        {
                            Microbe.insertStyle( selector, style.obj, media );
                        }
                    }
                    else
                    {
                        _removeStyle( style.el, media );
                    }
                }
                else
                {
                    return false;
                }
            }
        }
        else
        {
            return false;
        }

        return true;
    };


    /**
     * ## removeStyles
     *
     * removes all microbe added style tags for the given selector
     *
     * @param {String} selector selector to apply it to
     *
     * @return _Boolean_ removed or not
     */
    Microbe.removeStyles = function( selector )
    {
        return Microbe.removeStyle( selector, 'all' );
    };


    /**
     * ## toArray
     *
     * Methods returns all the elements in an array.
     *
     * @return _Array_
     */
    Microbe.toArray = Microbe.core.toArray;


    /**
     * ## toString
     *
     * Methods returns the type of Microbe.
     *
     * @return _String_
     */
    Microbe.toString = Microbe.core.toString;


    /**
     * ## type
     *
     * returns the type of the parameter passed to it
     *
     * @param {all} obj parameter to test
     *
     * @return _String_ typeof obj
     */
    Microbe.type = function( obj )
    {
        if ( obj === null )
        {
            return obj + '';
        }

        var type = Types[ Object.prototype.toString.call( obj ) ];
            type = !type ? Types[ obj.toString() ] : type;

        type = type || typeof obj;

        if ( type === 'object' && obj instanceof Promise )
        {
            type = 'promise';
        }

        return  type;
    };


    /**
     * ## xyzzy
     *
     * https://en.wikipedia.org/wiki/Xyzzy_(computing)
     *
     * @return _void_ */
    Microbe.xyzzy   = Microbe.noop;
};

},{"./utils/types":6}],6:[function(require,module,exports){
/**
 * types.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

/**
 * ## exported
 *
 * Type strings.
 *
 * @return _Object_
 */
module.exports =
{
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Error]'    : 'error',
    '[object Promise]'  : 'promise',
    '[object Microbe]'  : 'microbe'
};

},{}]},{},[1])(1)
});