module.exports = function( Microbe )
{
    Microbe.ready = function( _cb )
    {
        if ( document.readyState === 'complete' )
        {
            return _cb();
        }

        if ( window.addEventListener )
        {
            window.addEventListener( 'load', _cb, false );
        }
        else if ( window.attachEvent )
        {
            window.attachEvent( 'onload', _cb );
        }
        else
        {
          window.onload = _cb;
        }
    };
};
