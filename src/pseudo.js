/**
 * pseudo.js
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
    var pseudo = function( self, selector, _scope, _build )
    {
        var obj, _selector = selector;

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
                obj = Microbe.constructor.pseudo( self, res[ 0 ], _scope, _build );

                for ( var i = 1, lenI = res.length; i < lenI; i++ )
                {
                    obj = obj.find( res[ i ] );
                }
                return obj;
            }
            else
            {
                _selector = res[ 0 ];
            }
        }

        var _pseudoArray;
         pseudo     = _selector.split( ':' );
        _selector   = pseudo[ 0 ];
        pseudo.splice( 0, 1 );

        for ( var k = 0, lenK = pseudo.length; k < lenK; k++ )
        {
            _pseudoArray = pseudo[ k ].split( '(' );

            if ( !Microbe.constructor.pseudo[ _pseudoArray[ 0 ] ] )
            {
                _selector += ':' + pseudo[ k ];
                pseudo.splice( k, 1 );
            }
        }

        obj = _build.call( self, _scope.querySelectorAll( _selector ), _selector );

        var _sel, _var;
        for ( var h = 0, lenH = pseudo.length; h < lenH; h++ )
        {
            _sel = pseudo[ h ].split( '(' );
            _var = _sel[ 1 ];
            if ( _var )
            {
                _var = _var.slice( 0, _var.length - 1 );
            }
            _sel = _sel[ 0 ];

            if ( Microbe.constructor.pseudo[ _sel ] )
            {
                obj = Microbe.constructor.pseudo[ _sel ]( obj, _var, selector );
            }
        }
        return obj;
    };


    /**
     * ### blank
     *
     * matches elements that only contain content which consists of whitespace but are not empty
     * 
     * @param {Microbe} _el microbe to be filtered
     * 
     * @return _Microbe_
     */
    pseudo.blank = function( _el )
    {
        var resArray = [], text = _el.text();
        for ( var i = 0, lenI = text.length; i < lenI; i++ ) 
        {
            var _t = text[ i ];
            if ( /^\s+$/.test( _t ) )
            {
                resArray.push( _el[ i ] );
            }
        }

        return new Microbe( resArray );
    };


    /**
     * ### contains
     *
     * Returns only elements that contain the given text.  The supplied text
     * is compared ignoring case
     *
     * @param {Microbe} _el microbe to be filtered
     * @param {String} _var string to search for
     *
     * @return _Microbe_
     */
    pseudo.contains = function( _el, _var )
    {
        _var            = _var.toLowerCase();

        var textArray   = _el.text();
        var elements    = [];

        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            if ( textArray[ i ].toLowerCase().indexOf( _var ) !== -1 )
            {
                elements.push( _el[ i ] );
            }
        }
        return _el.constructor( elements );
    };


    /**
     * ### even
     *
     * Returns the even indexed elements of a microbe (starting at 0)
     *
     * @param {Microbe} _el microbe to be filtered
     *
     * @return _Microbe_
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
     * returns the first element of a microbe
     *
     * @param {Microbe} _el microbe to be filtered
     *
     * @return _Microbe_
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
     * @param {Microbe} _el microbe to be filtered
     * @param {String} _var number of elements to return
     *
     * @return _Microbe_
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
     * @param {Microbe} _el microbe to be filtered
     * @param {String} _var selector string
     *
     * @return _Microbe_
     */
    pseudo.has = function( _el, _var )
    {
        var i, lenI, _obj, results = [];

        for ( i = 0, lenI = _el.length; i < lenI; i++ )
        {
            _obj = _el.constructor( _var, _el[ i ] );

            if ( _obj.length !== 0 )
            {
                results.push( _el[ i ] );
            }
        }

        return _el.constructor( results );
    };


    /**
     * ### in-range
     *
     * select the elements with a value inside the specified range
     * 
     * @param {Microbe} _el microbe to be filtered
     * 
     * @return _Microbe_
     */
    pseudo[ 'in-range' ] = function( _el )
    {
        var _el = _el.filter( '[max],[min]' );

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
        return new Microbe( resArray );
    };


    /**
     * ### last
     *
     * returns the last element of a microbe
     *
     * @param {Microbe} _el microbe to be filtered
     *
     * @return _Microbe_
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
     * @param {Microbe} _el microbe to be filtered
     * @param {String} _var specified depth
     * 
     * @return _Microbe_
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

        return new Microbe( resArray );
    };


    /**
     * ### lt
     *
     * returns the first [_var] elements
     *
     * @param {Microbe} _el microbe to be filtered
     * @param {String} _var number of elements to return
     *
     * @return _Microbe_
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
     * @param {Microbe} _el microbe to be filtered
     * @param {String} _var number of elements to return
     * @param {String} _selector full original selector
     *
     * @return _Microbe_
     */
    pseudo.matches = function( _el, _var, _selector )
    {
        var text = ':matches(' + _var + ')';
        _var = _var.split( ',' );

        _selector = _selector.replace(  text, '' );
        _selector = _selector === '*' ? '' : _selector;

        var res = new Microbe( _selector + _var[ 0 ].trim() );

        for ( var i = 1, lenI = _var.length; i < lenI; i++ )
        {
            res.merge( new Microbe( _selector + _var[ i ].trim() ) );
        }

        return res;
    };


    /**
     * ### not
     *
     * returns all elements that do not match the given selector. As per
     * CSS4 spec, this accepts complex selectors seperated with a comma
     *
     * @param {Microbe} _el microbe to be filtered
     * @param {String} _var number of elements to return
     * @param {String} _recursive an indicator that it is calling itself. defines output
     *
     * @return _Microbe_
     */
    pseudo.not = function( _el, _var, _recursive )
    {
        if ( _var.indexOf( ',' ) !== -1 )
        {
            _var = _var.split( ',' );

            for ( var i = 0, lenI = _var.length; i < lenI; i++ )
            {
                _el = this.not( _el, _var[ i ].trim(), true );
            }
            return new Microbe( _el );
        }
        else
        {
            var resArray = [];
            for ( var j = 0, lenJ = _el.length; j < lenJ; j++ )
            {
                if ( ! Microbe.matches( _el[ j ], _var ) )
                {
                    resArray.push( _el[ j ] );
                }
            }
            if ( _recursive )
            {
                return resArray;
            }
            return new Microbe( resArray );
        }
    };


    /**
     * ### add
     *
     * returns the odd indexed elements of a microbe
     *
     * @param {Microbe} _el microbe to be filtered
     *
     * @return _Microbe_
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
     * @param  {[type]} _el [description]
     * 
     * @return {[type]}     [description]
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
     * @param {Microbe} _el microbe to be filtered
     * 
     * @return _Microbe_
     */
    pseudo[ 'out-of-range' ] = function( _el )
    {
        var _el = _el.filter( '[max],[min]' );

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
        return new Microbe( resArray );
    };


    /**
     * ### required
     *
     * returns all required elements
     *
     * @param {Microbe} _el microbe to be filtered
     *
     * @return _Microbe_
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
     * @param {Microbe} _el microbe to be filtered
     *
     * @return _Microbe_
     */
    pseudo.root = function( _el )
    {
        return _el.root();
    };


    /**
     * ### target
     *
     * returns a microbe with elements that match both the original selector, and the id of the page hash
     *
     * @param {Microbe} _el microbe to be filtered
     *
     * @return _Microbe_
     */
    pseudo.target = function( _el )
    {
        var hash = ( location.href.split( '#' )[ 1 ] );

        var elements = [];

        if ( hash )
        {
            for ( var i = 0, lenI = _el.length; i < lenI; i++ )
            {
                if ( _el[ i ].id === hash  )
                {
                    elements.push( _el[ i ] );
                }
            }
        }

        return _el.constructor( elements );
    };


    Microbe.constructor.prototype.pseudo = pseudo;
};
