/**
 * http.js
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
    var Promise = require( 'promise' );

    /**
     * ## http
     *
     * Method takes as many as necessary parameters, with url being the only required.
     * The return then has the methods `.then( _cb )` and `.error( _cb )`
     *
     * @param _Object_ _parameters          http parameters. possible properties
     *                                                  method, url, data, user, password, headers, async
     */
    Microbe.http = function( _parameters )
    {
        var fail, req, method, url, data, user, password, headers, async;

        if ( !_parameters )
        {
            return new Error( 'No parameters given' );
        }
        else
        {
            if ( typeof _parameters === 'string' )
            {
                _parameters = { url: _parameters };
            }

            req         = new XMLHttpRequest();
            method      = _parameters.method || 'GET';
            url         = _parameters.url;
            data        = JSON.stringify( _parameters.data ) || null;
            user        = _parameters.user || '';
            password    = _parameters.password || '';
            headers     = _parameters.headers  || null;
            async       = typeof _parameters.async === "boolean" ?
                                _parameters.async : true;

            req.onreadystatechange = function()
            {
                if ( req.readyState === 4 )
                {
                    return req;
                }
            };
        }

        req.open( method, url, async, user, password );

        // weird Safari voodoo fix
        if ( method === 'POST' )
        {
            req.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        }

        if ( headers )
        {
            for ( var header in headers )
            {
                req.setRequestHeader( header, headers[header] );
            }
        }

        if ( async )
        {
            return new Promise( function( resolve, reject )
            {
                req.onerror = function()
                {
                    reject( new Error( 'Network error!' ) );
                };

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
        }
        else
        {
            var _response = function( _val )
            {
                var _responses =
                {
                    /**
                     * ### .then
                     *
                     * Called after `http`, `http.get`, or `http.post`, this is
                     * called passing the result as the first parameter to the callback
                     *
                     * @param _Function_ _cb         function to call after http request
                     *
                     * @return _Object_ contains the `.catch` method
                     */
                    then: function( _cb )
                    {
                        if ( _val.status === 200 )
                        {
                            _cb( _val.responseText );
                        }
                        return _responses;
                    },


                    /**
                     * ### .catch
                     *
                     * Called after `http`, `http.get`, or `http.post`, this is
                     * called passing the error as the first parameter to the callback
                     *
                     * @param _Function_ _cb         function to call after http request
                     *
                     * @return _Object_ contains the `.then` method
                     */
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

            req.send( data );
            req.onloadend = function()
            {
                req.onreadystatechange();
                return _response( req );
            };

            return req.onloadend();
        }
    };

    /**
     * ## http.get
     *
     * Syntactic shortcut for simple GET requests
     *
     * @param _String_ _url                file url
     *
     * @return _Object_ contains `.then` and `.catch`
     */
    Microbe.http.get = function( _url )
    {
        return this({
            url     : _url,
            method  : 'GET'
        });
    };


    /**
     * ## http.post
     *
     * Syntactic shortcut for simple POST requests
     *
     * @param _String_ _url                file url
     * @param _Mixed_ _data               data to post to location _{Object or String}_
     *
     * @return _Object_ contains `.then` and `.catch`
     */
    Microbe.http.post = function( _url, _data )
    {
        return this({
            url     : _url,
            data    : _data,
            method  : 'POST'
        });
    };
};
