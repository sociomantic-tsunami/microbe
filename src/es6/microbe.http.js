/* jshint esnext: true*/
/**
 * microbe.http.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */


Microbe.prototype.http = function( _parameters )
{
    return new Promise( function( resolve, reject )
    {
        if ( !_parameters ) { reject( Error( 'No parameters given' ) ); }
        if ( typeof _parameters === 'string' )
        {
            _parameters = { url: _parameters };
        }

        let req         = new XMLHttpRequest();
        let method      = _parameters.method || 'GET';
        let url         = _parameters.url;
        let data        = JSON.stringify( _parameters.data ) || null;
        let user        = _parameters.user || '';
        let password    = _parameters.password || '';
        let headers     = _parameters.headers  || null;

        req.onreadystatechange = function()
        {
            if ( req.readyState === 4 )
            {
                return req;
            }
        };
        req.onerror = function()
        {
            reject( Error( 'Network error!' ) );
        };

        req.open( method, url, true, user, password );

        if ( headers )
        {
            if ( Array.isArray( headers ) )
            {
                for ( let i = 0, len = headers.length; i < len; i++ )
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
                reject( Error( req.status ) );
            }
        };
    });
};

Microbe.prototype.http.get = function( _url )
{
    return this({
        url     : _url,
        method  : 'GET'
    });
};

Microbe.prototype.http.post = function( _url, _data )
{
    return this({
        url     : _url,
        data    : _data,
        method  : 'POST'
    });
};


/******************************************************************************/
