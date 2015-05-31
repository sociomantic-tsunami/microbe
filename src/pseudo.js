module.exports = function( Microbe )
{
    Microbe.constructor.prototype.pseudo = {

        /**
         * returns only elements that contain the given text
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * @param  {String}         _var                string to search for
         * 
         * @return {Microbe}
         */
        contains : function( _el, _var )
        {
            var textArray   = _el.text();
            var elements    = [];
            for ( var i = 0, lenI = _el.length; i < lenI; i++ ) 
            {
                if ( textArray[ i ].indexOf( _var ) !== -1 )
                {
                    elements.push( _el[ i ] );
                }
            }
            return _el.constructor( elements );
        },


        /**
         * returns the even indexed elements of a microbe (starting at 0)
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * 
         * @return {Microbe}
         */
        even : function( _el )
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
        },


        /**
         * returns the first element of a microbe
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * 
         * @return {Microbe}
         */
        first : function( _el )
        { 
            return _el.first() 
        },


        /**
         * returns the last {_var} element
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * @param  {String}         _var                number of elements to return
         * 
         * @return {Microbe}
         */
        gt : function( _el, _var )
        {
            return _el.splice( _el.length - _var, _el.length );
        },


        // has       : function(){}


        /**
         * returns the last element of a microbe
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * 
         * @return {Microbe}
         */
        last : function( _el )
        { 
            return _el.last() 
        },


        /**
         * returns the first {_var} element
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * @param  {String}         _var                number of elements to return
         * 
         * @return {Microbe}
         */
        lt : function( _el, _var )
        {
            return _el.splice( 0, _var );
        },


        /**
         * returns the odd indexed elements of a microbe
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * 
         * @return {Microbe}
         */
        odd : function( _el )
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
        },


        /**
         * returns the root elements of the document
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * 
         * @return {Microbe}
         */
        root : function( _el )
        {
            return _el.root();
        },


        /**
         * returns a microbe with elements that match both the original selector, and the id of the page hash
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * 
         * @return {Microbe}
         */
        target : function( _el )
        {
            var hash = ( location.href.split( '#' )[ 1 ] )

            if ( hash )
            {
                var elements = [];
                for ( var i = 0, lenI = _el.length; i < lenI; i++ ) 
                {
                    if ( _el[ i ].id === hash  )
                    {
                        elements.push( _el[ i ] );
                    }
                }
            }
            
            return _el.constructor( elements );
        }
    };
};
