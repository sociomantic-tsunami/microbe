import Promise from 'promise';
import Microbe from './core';

/**
 * microbe.http.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

/**
 * Http takes as many of few parameters, with url being the only required.
 * The return then has the methods .then( _cb ) and .error( _cb )
 *
 * @param {Object}             _parameters          http parameters. possible properties
 *                                                  method, url, data, user, password, headers, async
 */
const http = ( _parameters ) =>
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

        req.onreadystatechange = () =>
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
        return new Promise( ( resolve, reject ) =>
        {
            req.onerror = () => reject( new Error( 'Network error!' ) );

            req.send( data );
            req.onload = () =>
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
        var _response = ( _val ) =>
        {
            var _responses =
            {
                /**
                 * .then()
                 *
                 * called after http(), http.get(), or http.post(), this is
                 * called passing the result as the first parameter to the callback
                 *
                 * @param  {Function}   _cb         function to call after http request
                 *
                 * @return {Object}                 contains the .catch method
                 */
                then: ( _cb ) =>
                {
                    if ( _val.status === 200 )
                    {
                        _cb( _val.responseText );
                    }
                    return _responses;
                },

                /**
                 * .catch()
                 *
                 * called after http(), http.get(), or http.post(), this is
                 * called passing the error as the first parameter to the callback
                 *
                 * @param  {Function}   _cb         function to call after http request
                 *
                 * @return {Object}                 contains the .then method
                 */
                catch: ( _cb ) =>
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
        req.onloadend = () =>
        {
            req.onreadystatechange();
            return _response( req );
        };
        return req.onloadend();
    }
};

/**
 * Syntactic shortcut for simple GET requests
 *
 * @param  {String}             _url                file url
 *
 * @return {Object}                                 contains .then() and .catch()
 */
http.get = ( _url ) =>
{
    return http({
        url     : _url,
        method  : 'GET'
    });
};


/**
 * Syntactic shortcut for simple POST requests
 *
 * @param  {String}             _url                file url
 * @param  {Object or String}   _data               data to post to location
 *
 * @return {Object}                                 contains .then() and .catch()
 */
http.post = ( _url, _data ) =>
{
    return http({
        url     : _url,
        data    : _data,
        method  : 'POST'
    });
};

Microbe.http = http;

export default http;
