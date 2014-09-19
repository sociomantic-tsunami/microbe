module.exports = function( Microbe )
{
    var selectorRegex   = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    var newElementRegex = /^<.+>$/;

    /**
     * Build
     *
     * builds and returns the final microbe
     *
     * @param  {[type]} microbe   [description]
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
     * @param  {[type]} _container [description]
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
        _scope = _scope === undefined ?  document : _scope;

        var scopeNodeType   = _scope.nodeType,
            nodeType        = _selector.nodeType || typeof _selector;


        if ( !( this instanceof Microbe.core.__init__ ) )
        {
            return new Microbe.core.__init__( _selector, _scope, _elements );
        }

        if ( ( !_selector || typeof _selector !== 'string' ) ||
             ( scopeNodeType !== 1 && scopeNodeType !== 9 ) )
        {
            return _build.call( this, [], _selector );
        }

        if ( _selector.nodeType === 1 )
        {
            return Microbe.core.create( _selector );
        }
        else if ( newElementRegex.test( _selector ) )
        {
            return Microbe.core.create( _selector.substring( 1, _selector.length - 1 ) );
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
            var resultsRegex = selectorRegex.exec( _selector );

            if ( resultsRegex )
            {
                var _classSelector  = resultsRegex[ 1 ],
                    _idSelector     = resultsRegex[ 2 ],
                    _tagSelector    = resultsRegex[ 3 ];

                if ( _classSelector && ! _idSelector && ! _tagSelector )
                {
// broken!
                    if ( ! selectorRegex.class.exec( _selector ) )
                    {
                        return _build.call( this, _scope.getElementsByClassName( _classSelector ), _selector );
                    }
                }

                if ( _idSelector && ! _tagSelector && ! _classSelector )
                {
                    var _id = document.getElementById( _idSelector );

                    if ( scopeNodeType === 9 )
                    {
                        if ( _id.parentNode && ( _id.id === _idSelector ) )
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

                if ( _tagSelector && ! _idSelector && ! _classSelector )
                {
                    return _build.call( this, _scope.getElementsByTagName( _tagSelector ), _selector );
                }
            }
        }
        return _build.call( this, _scope.querySelectorAll( _selector ), _selector );
    };

    Microbe.core.__init__.prototype = Microbe.core;

};
