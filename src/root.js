module.exports = function( Microbe )
{
    var Types       = require( './utils/types' );
    var _type       = Microbe.core.type;


    /**
     * Capitalize String
     *
     * capitalizes every word in a string or an array of strings and returns the
     * type that it was given
     *
     * @param  {String or Array}        text                string(s) to capitalize
     *
     * @return {String or Array}                            capitalized string(s)
     */
    Microbe.capitalize = function( text )
    {
        var array   = Microbe.isArray( text );
        text        = !array ? [ text ] : text;

        for ( var i = 0, lenI = text.length; i < lenI; i++ )
        {
            text[ i ] = text[ i ].split( ' ' );
            for ( var j = 0, lenJ = text[ i ].length; j < lenJ; j++ )
            {
                text[ i ][ j ] = text[ i ][ j ].charAt( 0 ).toUpperCase() + text[ i ][ j ].slice( 1 );
            }
            text[ i ] = text[ i ].join( ' ' );
        }

        return ( array ) ? text : text[ 0 ];
    };


    // british people....
    Microbe.capitalise = Microbe.capitalize;


    Microbe.extend = Microbe.core.extend;


    /**
     * Identify a value
     *
     * returns itself if a value needs to be executed
     *
     * @param  {any}                    value               any value
     *
     * @return {value}
     */
    Microbe.identity = function( value ) { return value; };


    Microbe.merge = Microbe.core.merge;


    /**
     * nothing happens
     *
     * https://en.wikipedia.org/wiki/Xyzzy_(computing)
     *
     * @return {void}
     */
    Microbe.noop    = function() {};
    Microbe.xyzzy   = Microbe.noop;


    /**
     * native isArray for completeness
     *
     * @type {Function}
     */
    Microbe.isArray = Array.isArray;


    /**
     * isEmpty
     *
     * checks if the passed object is empty
     *
     * @param  {Object}                 obj                 object to check
     *
     * @return {Boolean}                                    empty or not
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
     * isFunction
     *
     * checks if the passed parameter is a function
     *
     * @param  {Object}                 obj                 object to check
     *
     * @return {Boolean}                                    function or not
     */
    Microbe.isFunction = function( obj )
    {
        return Microbe.type( obj ) === "function";
    };


    /**
     * isObject
     *
     * checks if the passed parameter is an object
     *
     * @param  {Object}                 obj                 object to check
     *
     * @return {Boolean}                                    isObject or not
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
     * isUndefined
     *
     * @param  {String}                 obj                 property
     * @param  {Object}                 parent              object to check
     *
     * @return {Boolean}                                    obj in parent
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
     * isWindow
     *
     * checks if the passed parameter equals window
     *
     * @param  {Object}                 obj                 object to check
     *
     * @return {Boolean}                                    isWindow or not
     */
    Microbe.isWindow = function( obj )
    {
        return obj !== null && obj === obj.window;
    };


    /**
     * To string
     *
     * Methods returns the type of Microbe.
     *
     * @return  {String}
    */
    Microbe.toString = Microbe.prototype.toString = function()
    {
        return _type;
    };


    /**
     * To array
     *
     * Methods returns all the elements in an array.
     *
     * @return  {Array}
    */
    Microbe.toArray = Microbe.prototype.toArray = function( _arr )
    {
        _arr = _arr || this;
        return Array.prototype.slice.call( _arr );
    };


    /**
     * Type
     *
     * returns the type of the parameter passed to it
     *
     * @param  {all}                    obj                 parameter to test
     *
     * @return {String}                                     typeof obj
     */
    Microbe.type = function( obj )
    {
        if ( obj === null )
        {
            return obj + '';
        }

        var type = Types[ Object.prototype.toString.call( obj ) ];
            type = !type ? Types[ obj.toString() ] : type;
        return  type || typeof obj;
    };
};