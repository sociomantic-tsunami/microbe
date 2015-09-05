/**
 * Cytoplasm.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Cytoplasm
 */

var slice = Array.prototype.slice;

module.exports = function( _c, _type )
{
    'use strict';

    var trigger, _shortSelector;

    var selectorRegex = _c.prototype.__selectorRegex =  /(?:[\s]*\.([\w-_\.]+)|#([\w-_]+)|([^#\.:<][\w-_]*)|(<[\w-_#\.]+>)|:([^#\.<][\w-()_]*))/g;

    // TODO: Check if we hit the duck

    /**
     * ## _build
     *
     * Builds and returns the final Cytoplasm
     *
     * @param {Array} _elements array of elements
     * @param {String} _selector selector
     *
     * @return _Cytoplasm_ Cytoplasm wrapped elements
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
     * Method creates Cytoplasm from a passed string, and returns it
     *
     * @param {String} _el element to create
     * @param {Object} this reference to pass on to _build
     *
     * @return _Cytoplasm_
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
     * ## _createHtml
     * 
     * Method creates a Cytoplasm from an html string, and returns it
     *
     * @param {String} _el element to create
     * @param {Object} this reference to pass on to _build
     *
     * @return _Cytoplasm_
     */
    function _createHtml( _el, self )
    {
        var _ghost          = document.createElement( 'div' );
        _ghost.innerHTML    = _el;
        _el                 = slice.call( _ghost.children );

        for ( var i = 0, lenI = _el.length; i < lenI; i++ ) 
        {
            _ghost.removeChild( _el[ i ] );
        }

        return _build( _el, self );
    }


    /**
     * ## _css4StringReplace
     *
     * translates css4 strings
     *
     * @param {String} _string pre substitution string
     *
     * @return _String_ post substitution string
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
     * @param {String} _s   selector string
     * @param {Object} self this empty Cytoplasm
     *
     * @return _Cytoplasm_
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
                        return id === null ? _build( [], self ) : _build( [ id ], self );
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
                        else
                        {
                            clss = clss.split( '.' );

                            var res, _r, _el = document.getElementsByClassName( clss[ 0 ] );
                            for ( var c = 1, lenC = clss.length; c < lenC; c++ ) 
                            {
                                res = slice.call( document.getElementsByClassName( clss[ c ] ) );

                                for ( var r = 0, lenR = _el.length; r < lenR; r++ ) 
                                {
                                    _r = _el[ r ];

                                   if ( res.indexOf( _r ) === -1 )
                                   {
                                        _el[ r ] = null;
                                   }
                                }
                            }

                            return _build( _el, self ).filter( function( _e ){ return _e !== null; } );
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
     * Usage:   µ()                             ---> empty
     *          µ( '' )                         ---> empty
     *          µ( [] )                         ---> empty
     *          µ( 'div#test' )                 ---> selection
     *          µ( elDiv )                      ---> selection
     *          µ( [ elDiv1, elDiv2, elDiv3 ] ) ---> selection
     *          µ( '<div#test>' )               ---> creation
     *          µ( '<div id="test"></div>' )    ---> creation
     *
     * @param {Mixed} _selector HTML selector (Element String Array)
     * @param {Mixed} _scope scope to look inside (Element String Cytoplasm)
     * @param {Mixed} _elements elements to fill Cytoplasm with (optional) (Element or Array)
     *
     * @return _Cytoplasm_
     */
    var Init = _c.core.__init__ =  function( _selector, _scope, _elements )
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

            var next;

            for ( var n = 0, lenN = _scope.length; n < lenN; n++ )
            {
                next = new Init( _selector, _scope[ n ] );

                for ( var i = 0, lenI = next.length; i < lenI; i++ )
                {
                    if ( Array.prototype.indexOf.call( res, next[ i ] ) === -1 )
                    {
                        res[ res.length ] = next[ i ];
                        res.length++;
                    }
                }
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

        var scopeNodeType   = _scope.nodeType;

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

        // html creation string
        if ( _selector.indexOf( '/' ) !== -1 )
        {
            return _createHtml( _selector, this );
        }

        return _build( _scope.querySelectorAll( _selector ), this );
    };

    _c.core.type                 = _type;
    _c.core.__init__.prototype   = _c.core;

    require( './core' )( _c );
    require( './root' )( _c );
    require( './pseudo' )( _c );

    var _pseudo = _c.constructor.pseudo;
};
