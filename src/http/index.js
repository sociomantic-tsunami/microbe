module.exports = function( Microbe )
{
    var Promise = require( 'promise' );

    /**
     * microbe.http.js
     *
     * @author  Mouse Braun         <mouse@sociomantic.com>
     * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
     *
     * @package Microbe
     */
    Microbe.http = function( _parameters )
    {
        return new Promise( function( resolve, reject )
        {
            if ( !_parameters ) { reject( new Error( 'No parameters given' ) ); }
            if ( typeof _parameters === 'string' )
            {
                _parameters = { url: _parameters };
            }

            var req         = new XMLHttpRequest();
            var method      = _parameters.method || 'GET';
            var url         = _parameters.url;
            var data        = JSON.stringify( _parameters.data ) || null;
            var user        = _parameters.user || '';
            var password    = _parameters.password || '';
            var headers     = _parameters.headers  || null;

            req.onreadystatechange = function()
            {
                if ( req.readyState === 4 )
                {
                    return req;
                }
            };
            req.onerror = function()
            {
                reject( new Error( 'Network error!' ) );
            };

            req.open( method, url, true, user, password );

            if ( headers )
            {
                if ( Array.isArray( headers ) )
                {
                    for ( var i = 0, len = headers.length; i < len; i++ )
                    {
                        req.setRequestHeader( headers[i].header, headers[i].value );
                    }
                }
                else
                {
                    req.setRequestHeader( headers.header, headers.value );
                }
            }

            req.send( data );
            req.onload = function()
            {
                if ( req.status === 200 )
                {
                    resolve( req.response );
                }
                else
                {
                    reject( new Error( req.status ) );
                }
            };
        });
    };

    Microbe.http.get = function( _url )
    {
        return this({
            url     : _url,
            method  : 'GET'
        });
    };

    Microbe.http.post = function( _url, _data )
    {
        return this({
            url     : _url,
            data    : _data,
            method  : 'POST'
        });
    };
};
