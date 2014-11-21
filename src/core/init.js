module.exports = function( Microbe )
{
    var trigger, _shortSelector, selectorRegex   = /(?:[\s]*\.([\w-_\.]*)|#([\w-_]*)|([^#\.<][\w-_]*)|(<[\w-_#\.]*>))/g;

    /**
     * Build
     *
     * builds and returns the final microbe
     *
     * @param  {[type]} _elements [description]
     * @param  {[type]} _selector [description]
     *
     * @return {[type]}           [description]
     */
    function _build( _elements, _selector )
    {
        var i = 0, lenI = _elements.length;

        for ( ; i < lenI; i++ )
        {
            this[ i ] = _elements[ i ];
        }

        this.selector    = _selector;
        this.length      = i;

        return this;
    }


    /**
     * Contains
     *
     * checks if a given element is a child of _scope
     *
     * @param  {[type]} _el        [description]
     * @param  {[type]} _scope     [description]
     *
     * @return {[type]}            [description]
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
     * Get Selector
     *
     * returns the css selector from an element
     *
     * @param  {DOM Element}        _el         DOM element
     *
     * @return {string}                         css selector
     */
    function _getSelector( _el )
    {
        if ( _el.nodeType === 1 )
        {
            var tag     = _el.tagName.toLowerCase(),
                id      = ( _el.id ) ? '#' + _el.id : '',
                clss   = ( _el.className.length > 0 ) ? '.' + _el.className : '';
            clss = clss.replace( ' ', '.' );

            return tag + id + clss;
        }
        else
        {
            return 'fromArray';
        }
    }


    /**
     * Class Microbe
     *
     * Constructor.
     * Either selects or creates an HTML element and wraps in into an Microbe instance.
     * Usage:   µ('div#test')   ---> selection
     *          µ('<div#test>') ---> creation
     *
     * @param   _selector   string or HTMLElement   HTML selector
     * @param   _scope      HTMLElement             scope to look inside
     * @param   _elements   HTMLElement(s)          elements to fill Microbe with (optional)
     *
     * @return  Microbe
    */
    Microbe.core.__init__ =  function( _selector, _scope, _elements )
    {
        _selector = _selector || '';

        if ( _selector.nodeType === 1 || Object.prototype.toString.call( _selector ) === '[object Array]' )
        {
            _elements = _selector;
            _selector = ( _elements.length ) ? 'fromArray' : _getSelector( _elements );
        }

        _scope = _scope === undefined ?  document : _scope;
        var scopeNodeType   = _scope.nodeType,
            nodeType        = ( _selector ) ? _selector.nodeType || typeof _selector : null;

        if ( !( this instanceof Microbe.core.__init__ ) )
        {
            return new Microbe.core.__init__( _selector, _scope, _elements );
        }

        if ( ( !_selector || typeof _selector !== 'string' ) ||
             ( scopeNodeType !== 1 && scopeNodeType !== 9 ) )
        {
            return _build.call( this, [], _selector );
        }

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
            var resultsRegex = _selector.match( selectorRegex );

            if ( resultsRegex && resultsRegex.length === 1 )
            {
                trigger = resultsRegex[0][0];
                _shortSelector = _selector.slice( 1 );

                if ( trigger === '<' )
                {
                    return Microbe.core.create( _selector.substring( 1, _selector.length - 1 ) );
                }
                else if ( trigger === '.' )
                {
                    var _classesCount   = ( _selector || '' ).slice( 1 ).split( '.' ).length;

                    if ( _classesCount === 1 )
                    {
                        return _build.call( this, _scope.getElementsByClassName( _shortSelector ), _selector );
                    }
                }
                else if ( trigger === '#' )
                {
                    var _id = document.getElementById( _shortSelector );

                    if ( ! _id )
                    {
                        return _build.call( this, [], _selector );
                    }

                    if ( scopeNodeType === 9 )
                    {
                        if ( _id.parentNode && ( _id.id === _selector ) )
                        {
                            return _build.call( this, [ _id ], _selector );
                        }
                    }
                    else // scope not document
                    {
                        if ( _scope.ownerDocument && _contains( _id, _scope ) )
                        {
                            return _build.call( this, [ _id ], _selector );
                        }
                    }
                }
                else // if ( _tagSelector ) // && ! _idSelector && ! _classSelector )
                {
                    return _build.call( this, _scope.getElementsByTagName( _selector ), _selector );
                }
            }
        }
        return _build.call( this, _scope.querySelectorAll( _selector ), _selector );
    };

    Microbe.core.__init__.prototype = Microbe.core;
};
