/**
 * init.js
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

    var trigger, _shortSelector;

    var selectorRegex = Microbe.prototype.__selectorRegex =  /(?:[\s]*\.([\w-_\.]+)|#([\w-_]+)|([^#\.:<][\w-_]*)|(<[\w-_#\.]+>)|:([^#\.<][\w-()_]*))/g;

    // TODO: Check if we hit the duck

    /**
     * ## _build
     *
     * Builds and returns the final microbe
     *
     * @param {Array} _elements array of elements
     * @param {String} _selector selector
     *
     * @return _Microbe_ microbe wrapped elements
     */
    function _build( _elements, self )
    {
        var i = 0, lenI = _elements.length;

        for ( ; i < lenI; i++ )
        {
            // _elements[ i ].data = _elements[ i ].data || {};
            self[ i ]           = _elements[ i ];
        }

        self.length     = i;

        return self;
    }


    /**
     * ## _create
     *
     * Method creates a Microbe from an element or a new element of the passed string, and
     * returns the Microbe
     *
     * @param {Element} _el element to create
     *
     * @return _Microbe_
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
     * ## _contains
     *
     * Checks if a given element is a child of _scope
     *
     * @param {Element} _el element to check
     * @param {Element} _scope scope
     *
     * @return _Boolean_ whether _el is contained in the scope
     */
    var _contains = Microbe.contains = function( _el, _scope )
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
     * @param  {Object} self this empty Microbe
     *
     * @return _Microbe_
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
     * Either selects or creates an HTML element and wraps it into a Microbe instance.
     * Usage:   µ( 'div#test' )   ---> selection
     *          µ( '<div#test>' ) ---> creation
     *
     * @param {Mixed} _selector HTML selector (Element String Array)
     * @param {Mixed} _scope scope to look inside (Element String Microbe)
     * @param {Mixed} _elements elements to fill Microbe with (optional) (Element or Array)
     *
     * @return _Microbe_
     */
    var Init = Microbe.core.__init__ =  function( _selector, _scope, _elements )
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

        if ( _scope && _scope.type === '[object Microbe]' )
        {
            res = _build( [], this );

            for ( var n = 0, lenN = _scope.length; n < lenN; n++ )
            {
                res.merge( new Init( _selector, _scope[ n ] ), null, true );
            }

            return res;
        }

        /*
         * fast tracks element based queries
         */
        if ( _selector.nodeType === 1 || Microbe.isArray( _selector ) ||
            _selector === window || _selector === document )
        {
            _selector = Microbe.isArray( _selector ) ? _selector : [ _selector ];
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

                    if ( _scope.ownerDocument && _contains( _id, _scope ) )
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

        if ( _selector.indexOf( ':' ) !== -1 )
        {
            return Microbe.constructor.pseudo( this, _selector, _scope, _build );
        }

        return _build( _scope.querySelectorAll( _selector ), this );
    };

    Microbe.core.__init__.prototype = Microbe.core;
};
