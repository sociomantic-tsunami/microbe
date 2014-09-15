/**
 * microbe.http.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */


Microbe.prototype.http = (function()
{
    var _response = function( _val )
    {
        var _responses =
        {
            then: function( _cb )
            {
                if ( _val.status === 200 )
                {
                    _cb( _val.responseText );
                }
                return _responses;
            },
            catch: function( _cb )
            {
                if ( _val.status !== 200 )
                {
                    _cb({
                        status      : _val.status,
                        statusText  : _val.statusText
                    });
                }
                return _responses;
            }
        };
        return _responses;
    };

    var _http = function( _parameters )
    {
        if ( !_parameters ) { return undefined; }
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

        req.open( method, url, false, user, password );

        if ( headers )
        {
            if ( Object.prototype.toString.call( headers ) === '[object Array' )
            {
                var i, leni;
                for ( i = 0, leni = headers.length; i < leni; i++ )
                {
                    req.setRequestHeader( headers[i].header, headers[i].value );
                }
            }
            else
            {
                req.setRequestHeader( headers.header, headers.value );
            }
        }
        try
        {
            req.send( data );
            req.onloadend = function()
            {
                req.onreadystatechange();
                return _response( req );
            };
            return req.onloadend();
        }
        catch ( error )
        {
            return _response( req, false );
        }
    };

    _http.get = function( _url )
    {
        if ( !_url ) { return undefined; }
        return this({
            url     : _url,
            method  : 'GET'
        });
    };

    _http.post = function( _url, _data )
    {
        if ( !_url || !_data ) { return undefined; }
        return this({
            url     : _url,
            data    : _data,
            method  : 'POST'
        });
    };

    return _http;
}());


/******************************************************************************/
