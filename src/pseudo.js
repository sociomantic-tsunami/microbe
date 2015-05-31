module.exports = function( Microbe )
{
    Microbe.constructor.prototype.pseudo = {


        // contains  : function( _el ){},


        /**
         * returns the even indexed elements of a microbe (starting at 0)
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * 
         * @return {Microbe}
         */
        even      : function( _el )
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
        first     : function( _el )
        { 
            return _el.first() 
        },


        // gt        : function( _el ){},


        // has       : function(){}


        /**
         * returns the last element of a microbe
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * 
         * @return {Microbe}
         */
        last      : function( _el )
        { 
            return _el.last() 
        },


        // lt        : function( _el ){},


        /**
         * returns the odd indexed elements of a microbe
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * 
         * @return {Microbe}
         */
        odd       : function( _el )
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
        root      : function( _el )
        {
            _root = _el[ 0 ];

            if ( _root )
            {
                while ( _root.parentNode !== document )
                {
                    _root = _root.parentNode
                }

                return _el.constructor( [ _root ] );
            }
            
            return _el.constructor( [] );
        },


        /**
         * returns a microbe with elements that match both the original selector, and the id of the page hash
         * 
         * @param  {Microbe}        _el                 microbe to be filtered
         * 
         * @return {Microbe}
         */
        target    : function( _el )
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
