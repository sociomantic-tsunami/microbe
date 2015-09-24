/**
 * pseudo.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

module.exports = function( Microbe )
{
    'use strict';

    /**
     * ## _parseNth
     *
     * when supplied with a Microbe and a css style n selector (2n1), filters
     * and returns the result
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var number string
     * @param {Boolean} _last counting from the font or back
     *
     * @return _Microbe_
     */
    var _parseNth = function( _el, _var, _last )
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
                    return new Microbe( _el[ _el.length - parseInt( _var ) ] );
            }
            return new Microbe( _el[ parseInt( _var ) - 1 ] );
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
            return new Microbe( resArray );
        }
    };


    /**
     * ## pseudo
     *
     * an extension to core.__init_ to handle custom pseusoselectors
     *
     * @param  {Microbe} self half built Microbe
     * @param  {String} selector pseudo-selector string
     * @param  {Object} _scope scope element
     * @param  {Function} _build build function from core
     *
     * @return _Microbe_
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
         * @return _Microbe_
         */
        function _breakUpSelector( _selectors )
        {
            var next, resArray = [];
            for ( var i = 0, lenI = _selectors.length; i < lenI; i++ )
            {
                if ( i === 0 )
                {
                    resArray = pseudo( self, _selectors[ i ], _scope, _build );
                }
                else
                {
                    next = pseudo( self, _selectors[ i ], _scope, _build );

                    for ( var j = 0, lenJ = next.length; j < lenJ; j++ )
                    {
                        if ( Array.prototype.indexOf.call( resArray, next[ j ] ) === -1 )
                        {
                            resArray[ resArray.length ] = next[ j ];
                            resArray.length++;
                        }
                    }
                }
            }

            return resArray;
        }


        /**
         * ## _buildObject
         *
         * builds the Microbe ready for return
         *
         * @return _Microbe_
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

                if ( Microbe.constructor.pseudo[ _sel ] )
                {
                    obj = Microbe.constructor.pseudo[ _sel ]( obj, _var, selector );
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
         * @return _Microbe_
         */
        function _cycleFilters( res )
        {
            var obj = Microbe.constructor.pseudo( self, res[ 0 ], _scope, _build );

            var filter, connect = false;
            for ( var i = 1, lenI = res.length; i < lenI; i++ )
            {
                filter = res[ i ].trim();

                if ( filter[ 0 ] === '~' )
                {
                    obj = obj.siblingsFlat();
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
         * @param {String} _sel selector string
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

                if ( !Microbe.constructor.pseudo[ _pseudoArray[ 0 ] ] )
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
     * ## _filteredIteration
     *
     * special iterator that dumps all results ito one array
     * 
     * @param  {Microbe} _el elements to cycle through
     * @param  {Function} _cb callback
     * 
     * @return _Microbe_ filtered microbe
     */
    function _filteredIteration( _el, _cb, _recursive )
    {
        var _r, resArray = [], _f = 0;
        for ( var i = 0, lenI = _el.length; i < lenI; i++ )
        {
            _r = _cb( _el[ i ], resArray, i );

            if ( _r )
            {
                resArray[ _f ] = _r;
                _f++;
            }
        }

        if ( _recursive )
        {
            return resArray;
        }

        return _el.constructor( resArray );
    }


    /**
     * ## any-link
     *
     * match elements that act as the source anchors of hyperlinks
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:any-link' );
     * 
     * @return _Microbe_
     */
    pseudo[ 'any-link' ] = function( _el )
    {
        return _el.filter( 'a' );
    };


    /**
     * ## blank
     *
     * matches elements that only contain content which consists of whitespace
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:blank' );
     *
     * @return _Microbe_
     */
    pseudo.blank = function( _el )
    {
        var _blank = function( _e, resArray )
        {
            var _t = document.all ? _e.innerText : _e.textContent;

            if ( resArray.indexOf( _e ) === -1 )
            {
                if ( /^\s*$/.test( _t || _e.value ) )
                {
                    return _e;
                }
            }
        };

        return _filteredIteration( _el, _blank );
    };


    /**
     * ## column
     *
     * filters for columns with a suplied selector
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var string to search for
     *
     * @example µ( '.example:column' );
     *
     * @return _Microbe_
     */
    pseudo.column = function( _el, _var )
    {
        return _el.filter( 'col' ).filter( _var );
    };


    /**
     * ## contains
     *
     * Returns only elements that contain the given text.  The supplied text
     * is compared ignoring case
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var string to search for
     *
     * @example µ( '.example:contains(moon)' );
     * 
     * @return _Microbe_
     */
    pseudo.contains = function( _el, _var )
    {
        _var = _var.toLowerCase();

        var _contains = function( _e )
        {
            var _getText = function( _el )
            {
                return document.all ? _el.innerText : _el.textContent; // ff
            };

            var _elText = _getText( _e );

            if ( _elText.toLowerCase().indexOf( _var ) !== -1 )
            {
                return _e;
            }
        };

        return _filteredIteration( _el, _contains );
    };


    /**
     * ## default
     *
     * selects all inputs and select boxes that are checked by dafeult
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:default' );
     * 
     * @return _Microbe_
     */
    pseudo.default = function( _el )
    {
        _el = _el.filter( 'input, option' );

        var _default = function( _e )
        {
            if ( _e.defaultChecked === true )
            {
                return _e;
            }
        };

        return _filteredIteration( _el, _default );
    };


    /**
     * ## dir
     *
     * match elements by its directionality based on the document language
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var string to search for
     *
     * @example µ( '.example:dir(ltr)' );
     * 
     * @return _Microbe_
     */
    pseudo.dir = function( _el, _var )
    {
        var _dir = function( _e )
        {
            if ( getComputedStyle( _e ).direction === _var )
            {
                return _e;
            }
        };

        return _filteredIteration( _el, _dir );
    };


    /**
     * ## drop
     *
     * returns all elements that are drop targets. HTML has a dropzone
     * attribute which specifies that an element is a drop target.
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var trigger string
     *
     * @example µ( '.example:drop' );
     * 
     * @return _Microbe_
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
     * ## even
     *
     * Returns the even indexed elements of a Microbe (starting at 0)
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:even' );
     *
     * @return _Microbe_
     */
    pseudo.even = function( _el )
    {
        var _even = function( _e, resArray, i )
        {
            if ( ( i + 1 ) % 2 === 0 )
            {
                return _e;
            }
        };

        return _filteredIteration( _el, _even );
    };


    /**
     * ## first
     *
     * returns the first element of a Microbe
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:first' );
     *
     * @return _Microbe_
     */
    pseudo.first = function( _el )
    {
        return _el.first();
    };


    /**
     * ## gt
     *
     * returns the last {_var} element
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var number of elements to return
     *
     * @example µ( '.example:gt(4)' );
     * 
     * @return _Microbe_
     */
    pseudo.gt = function( _el, _var )
    {
        return _el.splice( _var, _el.length );
    };


    /**
     * ## has
     *
     * returns elements that have the passed selector as a child
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var selector string
     *
     * @example µ( '.example:has(span)' );
     * 
     * @return _Microbe_
     */
    pseudo.has = function( _el, _var )
    {
        var _has = function( _e )
        {
            if ( _e.querySelector( _var ) )
            {
                return _e;
            }
        };

        return _filteredIteration( _el, _has );
    };


    /**
     * ## in-range
     *
     * select the elements with a value inside the specified range
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:in-range' );
     *
     * @return _Microbe_
     */
    pseudo[ 'in-range' ] = function( _el )
    {
        _el = _el.filter( '[max],[min]' );

        var _inRange = function( _e )
        {
            var min = _e.getAttribute( 'min' );
            var max = _e.getAttribute( 'max' );
            var _v  = parseInt( _e.value );

            if ( _v )
            {
                if ( min && max )
                {
                    if ( _v > min && _v < max )
                    {
                        return _e;
                    }
                }
                else if ( min && _v > min || max && _v < max )
                {
                    return _e;
                }
            }
        };

        return _filteredIteration( _el, _inRange );
    };


    /**
     * ## lang
     *
     * match the elements based on the document language
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var specified language (accepts wildcards as *)
     *
     * @example µ( '.example:lang(gb-en)' );
     * @example µ( '.example:lang(*-en)' );
     * 
     * @return _Microbe_
     */
    pseudo.lang = function( _el, _var )
    {
        if ( _var )
        {
            if ( _var.indexOf( '*' ) !== -1 )
            {
                _el     = _el.filter( '[lang]' );
                _var    = _var.replace( '*', '' );

                var _lang = function( _e )
                {
                    if ( _e.getAttribute( 'lang' ).indexOf( _var ) !== -1 )
                    {
                        return _e;
                    }
                };

                return _filteredIteration( _el, _lang );
            }

            var res = document.querySelectorAll( ':lang(' + _var + ')' );
            return _el.constructor( Array.prototype.slice.call( res ) );
        }
        else
        {
            return _el.constructor( [] );
        }
    };


    /**
     * ## last
     *
     * returns the last element of a Microbe
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:last' );
     * 
     * @return _Microbe_
     */
    pseudo.last = function( _el )
    {
        return _el.last();
    };



    /**
     * ## local-link
     *
     * returns all link tags that go to local links. If specified a depth
     * filter can be added
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var specified depth
     *
     * @example µ( '.example:local-link' );
     * @example µ( '.example:local-link(2)' );
     * 
     * @return _Microbe_
     */
    pseudo[ 'local-link' ] = function( _el, _var )
    {
        _el = _el.filter( 'a' );
        var here    = document.location;

        var _localLink = function( _e )
        {
            var url         = _e.href;
            var urlShort    = url.replace( here.origin, '' ).replace( here.host, '' );
            urlShort        = urlShort[ 0 ] === '/' ? urlShort.slice( 1 ) : urlShort;
            var depth       = urlShort.split( '/' ).length - 1;

            if ( !_var || parseInt( _var ) === depth )
            {
                return _e;
            }
        };

        return _filteredIteration( _el, _localLink );
    };


    /**
     * ## lt
     *
     * returns the first [_var] elements
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var number of elements to return
     *
     * @example µ( '.example:lt(2)' );
     * 
     * @return _Microbe_
     */
    pseudo.lt = function( _el, _var )
    {
        return _el.splice( 0, _var );
    };


    /**
     * ## matches
     *
     * returns elements that match either selector
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var selector filter
     * @param {String} _selector full original selector
     *
     * @example µ( '.example:matches(div)' );
     * 
     * @return _Microbe_
     */
    pseudo.matches = function( _el, _var, _selector )
    {
        var _constructor = _el.constructor;

        var text = ':matches(' + _var + ')';
        _var = _var.split( ',' );

        _selector = _selector.replace(  text, '' );
        _selector = _selector === '*' ? '' : _selector;

        var res = _constructor( _selector + _var[ 0 ].trim() );

        for ( var i = 1, lenI = _var.length; i < lenI; i++ )
        {
            res.merge( _constructor( _selector + _var[ i ].trim() ), true );
        }

        return res;
    };


    /**
     * ## not
     *
     * returns all elements that do not match the given selector. As per
     * CSS4 spec, this accepts complex selectors seperated with a comma
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var null selector
     * @param {String} _recursive an indicator that it is calling itself. defines output
     *
     * @example µ( '.example:not(div)' );
     * @example µ( '.example:not(div,#an--id)' );
     * 
     * @return _Microbe_
     */
    pseudo.not = function( _el, _var, _selector, _recursive )
    {
        if ( _var.indexOf( ',' ) !== -1 )
        {
            var _constructor = _el.constructor;
            _var = _var.split( ',' );

            for ( var i = 0, lenI = _var.length; i < lenI; i++ )
            {
                _el = this.not( _el, _var[ i ].trim(), _selector, true );
            }

            return _constructor( _el );
        }
        else
        {
            var _not = function( _e )
            {  
                if ( ! Microbe.matches( _e, _var ) )
                {
                    return _e;
                }
            };

            return _filteredIteration( _el, _not, _recursive );
        }
    };


    /**
     * ## nth-column
     *
     * returns the nth column of the current Microbe
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var column number(s) return
     *
     * @example µ( '.example:nth-column(1)' );
     * @example µ( '.example:nth-column(2n1)' );
     * @example µ( '.example:nth-column(even)' );
     * @example µ( '.example:nth-column(odd)' );
     * 
     * @return _Microbe_
     */
    pseudo[ 'nth-column' ] = function( _el, _var )
    {
        _el = _el.filter( 'col' );

        return _parseNth( _el, _var );
    };


    /**
     * ## nth-last-column
     *
     * returns the nth column of the current Microbe starting from the back
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var column number(s) return
     *
     * @example µ( '.example:nth-last-column(1)' );
     * @example µ( '.example:nth-last-column(2n1)' );
     * @example µ( '.example:nth-last-column(even)' );
     * @example µ( '.example:nth-last-column(odd)' );
     * 
     * @return _Microbe_
     */
    pseudo[ 'nth-last-column' ] = function( _el, _var )
    {
        _el = _el.filter( 'col' );

        return _parseNth( _el, _var, true );
    };


    /**
     * ## nth-last-match
     *
     * returns the nth match(es) of the current Microbe starting from the back
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var match number(s) return
     *
     * @example µ( '.example:nth-last-match(1)' );
     * @example µ( '.example:nth-last-match(2n1)' );
     * @example µ( '.example:nth-last-match(even)' );
     * @example µ( '.example:nth-last-match(odd)' );
     * 
     * @return _Microbe_
     */
    pseudo[ 'nth-last-match' ] = function( _el, _var )
    {
        return _parseNth( _el, _var, true );
    };


    /**
     * ## nth-match
     *
     * returns the nth match(es) of the current Microbe
     *
     * @param {Microbe} _el Microbe to be filtered
     * @param {String} _var match number(s) return
     *
     * @example µ( '.example:nth-match(1)' );
     * @example µ( '.example:nth-match(2n1)' );
     * @example µ( '.example:nth-match(even)' );
     * @example µ( '.example:nth-match(odd)' );
     * 
     * @return _Microbe_
     */
    pseudo[ 'nth-match' ] = function( _el, _var )
    {
        return _parseNth( _el, _var );
    };


    /**
     * ## odd
     *
     * returns the odd indexed elements of a Microbe
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:odd' );
     * 
     * @return _Microbe_
     */
    pseudo.odd = function( _el )
    {
        var _odd = function( _e, resArray, i )
        {
            if ( ( i + 1 ) % 2 !== 0 )
            {
                return _e;
            }
        };

        return _filteredIteration( _el, _odd );
    };


    /**
     * ## optional
     *
     * returns all optional elements
     *
     * @param {Microbe} _el base elements set
     *
     * @example µ( '.example:optional' );
     * 
     * @return _Microbe_
     */
    pseudo.optional = function( _el )
    {
        return _el.filter( 'input:not([required=required]), textfield:not([required=required]), [required=optional], [optional]' );
    };


    /**
     * ## out-of-range
     *
     * select the elements with a value inside the specified range
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:out-of-range' );
     * 
     * @return _Microbe_
     */
    pseudo[ 'out-of-range' ] = function( _el )
    {
        _el = _el.filter( '[max],[min]' );

        var _outOfRange = function( _e )
        {
            var min = _e.getAttribute( 'min' );
            var max = _e.getAttribute( 'max' );
            var _v  = parseInt( _e.value );

            if ( _v )
            {
                if ( min && max )
                {
                    if ( _v < min || _v > max )
                    {
                        return _e;
                    }
                }
                else if ( min && _v < min || max && _v > max )
                {
                    return _e;
                }
            }
        };

        return _filteredIteration( _el, _outOfRange );
    };


    /**
     * ## parent
     *
     * returns the parents of an _el match.
     * normally triggered using the ! selector
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example!' );
     * @example µ( '.example:parent' );
     * 
     * @return _Microbe_
     */
    pseudo.parent = function( _el )
    {
        _el =  _el.parent();

        var _parent = function( _e, resArray, i )
        {
            if ( resArray.indexOf( _e ) === -1 )
            {
                return _e;
            }
        };

        return _filteredIteration( _el, _parent );
    };


    /**
     * ## read-only
     *
     * user-non-alterable content
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:read-only' );
     * 
     * @return _Microbe_
     */
    pseudo[ 'read-only' ] = function( _el )
    {
        return _el.filter( ':not(input,textfield,[contenteditable=false])' );
    };


    /**
     * ## read-write
     *
     * input elements which are user-alterable or contenteditable
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:read-write' );
     * 
     * @return _Microbe_
     */
    pseudo[ 'read-write' ] = function( _el )
    {
        return _el.filter( 'input,textfield,[contenteditable=true]' );
    };


    /**
     * ## required
     *
     * returns all required elements
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:required' );
     * 
     * @return _Microbe_
     */
    pseudo.required = function( _el )
    {
        return _el.filter( '[required=required]' );
    };


    /**
     * ## root
     *
     * returns the root elements of the document
     *
     * @param {Microbe} _el Microbe to be filtered
     *
     * @example µ( '.example:root );
     * 
     * @return _Microbe_
     */
    pseudo.root = function( _el )
    {
        return _el.constructor( document.body.parentNode );
    };



    Microbe.constructor.prototype.pseudo = pseudo;
};

