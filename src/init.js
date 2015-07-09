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
    function _build( _elements, _selector )
    {
        var i = 0, lenI = _elements.length;

        for ( ; i < lenI; i++ )
        {
            if ( _elements[ i ] )
            {
                _elements[ i ].data = _elements[ i ].data || {};
                this[ i ]           = _elements[ i ];
            }
        }

        this._selector  = _selector;
        this.length     = i;

        return this;
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
    function _create( _el )
    {
        var resultsRegex    = _el.match( selectorRegex ),
            _id = '', _tag = '', _class = '', _selector = '';

        var i, lenI;
        for ( i = 0, lenI = resultsRegex.length; i < lenI; i++ )
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
            _selector = _tag;

            if ( _id )
            {
                _selector += _id;
                _el.id = _id.slice( 1 );
            }

            if ( _class )
            {
                _selector += _class;
                _class = _class.split( '.' );

                for ( i = 1, lenI = _class.length; i < lenI; i++ )
                {
                    _el.classList.add( _class[ i ] );
                }
            }

        }

        return _build.call( this, [ _el ],  _selector );
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
    function _contains( _el, _scope )
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
    }

    /**
     * ## \_\_init\_\_
     *
     * Constructor.
     *
     * Either selects or creates an HTML element and wraps it into a Microbe instance.
     * Usage:   µ('div#test')   ---> selection
     *          µ('<div#test>') ---> creation
     *
     * @param {Mixed} _selector HTML selector (Element String Array)
     * @param {Mixed} _scope scope to look inside (Element String Microbe)
     * @param {Mixed} _elements elements to fill Microbe with (optional) (Element or Array)
     *
     * @return _Microbe_
     */
    Microbe.core.__init__ =  function( _selector, _scope, _elements )
    {
        if ( !_scope )
        {
            /*
             * fast tracks simple queries
             */
            if ( _selector && typeof _selector === 'string' &&
                    _selector.indexOf( ':' ) === -1 )
            {
                var _s = _selector[0];
                var _i, _c, _p;

                if ( _s !== '<' &&  _selector.indexOf( ':' ) === -1 &&
                                _selector.indexOf( ' ' ) === -1 )
                {
                    switch ( _s )
                    {
                        case '#':
                            if ( _selector.indexOf( '.' ) === -1 )
                            {
                                var id = document.getElementById( _selector.slice( 1 ) );

                                if ( id )
                                {
                                    id = [ id ];
                                }
                                else
                                {
                                    id = [];
                                }

                                return _build.call( this, id, _selector );
                            }
                            break;
                        case '.':
                            if ( _selector.indexOf( '#' ) === -1 )
                            {
                                var clss = _selector.slice( 1 );

                                if ( clss.indexOf( '.' ) === -1 )
                                {
                                    clss = document.getElementsByClassName( clss );

                                    return _build.call( this, clss, _selector );
                                }
                            }
                            break;
                        default:
                            if ( _selector.indexOf( '#' ) === -1 &&
                                 _selector.indexOf( '.' ) === -1 )
                            {
                                var tag = document.getElementsByTagName( _selector );

                                return _build.call( this, tag, _selector );
                            }
                    }
                }
            }
        }
        else if ( typeof _scope === 'string' )
        {
            // CSS4 replace
            _scope = _scope.replace( /(?: )?>>(?: )?/g, ' ' );
        }

        _selector = _selector || '';

        if ( typeof _selector === 'string' )
        {
            // CSS4 replace
            _selector = _selector.replace( /(?: )?>>(?: )?/g, ' ' );
        }

        if ( _scope && _scope.type === '[object Microbe]' )
        {
            var res = _build.call( this, [], _selector );

            for ( var n = 0, lenN = _scope.length; n < lenN; n++ )
            {
                res.merge( new Microbe.core.__init__( _selector, _scope[ n ], _elements ) );
            }

            return res;
        }

        /*
         * fast tracks element based queries
         */
        if ( _selector.nodeType === 1 || Object.prototype.toString.call( _selector ) === '[object Array]' ||
            _selector === window || _selector === document )
        {
            _selector = Microbe.isArray( _selector ) ? _selector : [ _selector ];
            return _build.call( this, _selector,  '' );
        }

        _scope = _scope === undefined ?  document : _scope;

        if ( _scope !== document )
        {
            if ( typeof _scope === 'string' && typeof _selector === 'string' )
            {
                if ( _selector.indexOf( ',' ) !== -1 || _scope.indexOf( ',' ) !== -1 )
                {
                    var newSelector = '';
                    _selector   = _selector.split( ',' );
                    _scope      = _scope.split( ',' );

                    for ( var i = 0, lenI = _scope.length; i < lenI; i++ )
                    {
                        for ( var j = 0, lenJ = _selector.length; j < lenJ; j++ )
                        {
                            newSelector += _scope[ i ] + ' ' + _selector[ j ] + ', ';
                        }
                    }

                    newSelector = newSelector.trim();
                    newSelector = newSelector.slice( 0, newSelector.length - 1 );
                }
                else
                {
                    _selector   = _scope + ' ' + _selector;
                    _scope      = document;
                }
            }
        }

        var scopeNodeType   = _scope.nodeType,
            nodeType        = ( _selector ) ? _selector.nodeType || typeof _selector : null;

        if ( _elements )
        {
            if ( Object.prototype.toString.call( _elements ) === '[object Array]' )
            {
                return _build.call( this, _elements, _selector );
            }
            else
            {
                return _build.call( this, [ _elements ], _selector );
            }
        }
        else
        {
            if ( ( !_selector || typeof _selector !== 'string' ) ||
                ( scopeNodeType !== 1 && scopeNodeType !== 9 ) )
            {
                return _build.call( this, [], _selector );
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
                            return _build.call( this, _scope.getElementsByClassName( _shortSelector ), _selector );
                        }
                        break;
                    case '#': // non-document scoped id search
                        var _id = document.getElementById( _shortSelector );

                        if ( _scope.ownerDocument && _contains( _id, _scope ) )
                        {
                            return _build.call( this, [ _id ], _selector );
                        }
                        break;
                    case '<': // element creation
                        return _create.call( this, _selector.substring( 1, _selector.length - 1 ) );
                    default:
                        return _build.call( this, _scope.getElementsByTagName( _selector ), _selector );
                }
            }
        }

        if ( !( this instanceof Microbe.core.__init__ ) )
        {
            return new Microbe.core.__init__( _selector, _scope, _elements );
        }

        if ( _selector.indexOf( ':' ) !== -1 )
        {
            return Microbe.constructor.pseudo( this, _selector, _scope, _build );
        }

        return _build.call( this, _scope.querySelectorAll( _selector ), _selector );
    };

    Microbe.core.__init__.prototype = Microbe.core;
};
