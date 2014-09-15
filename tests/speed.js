/*globals µ, $*/
var native = document.querySelectorAll.bind( document );
var time = function( options, callback, name, activated )
{
    var res;
    if ( !activated )
    {
        return false;
    }
    res = options ? options() : null;
    console.time( name );
    res = callback( res );
    console.timeEnd( name );
    //console.log( res );
    return res;
};

(function setup()
{
    var length = 100000;
    var div;
    for (var i = 0; i < length; i++)
    {
        div = document.createElement( 'div' );
        div.classList.add( 'speed' );
        document.body.appendChild( div );
    }
}());

// QUERIES
time( null, function()
{
    var query = 'div.speed';

    return native( query );
}, 'native query', true );

time( null, function( q )
{
    var query = 'div.speed';

    return µ( query );
}, 'µ query', true );


time( null, function()
{
    var query = 'div.speed';

    return $( query );
}, '$ query', true );

// ADD CLASS
time( function()
{
    return native( 'div.speed' );
},
function( q )
{
    var cls = 'added-native';
    for (var i = 0; i < q.length; i++)
    {
        q[i].classList.add( cls );
    }
    return q;
}, 'native addClass', true );

time( function()
{
    return µ( 'div.speed' );
},
function( q )
{
    q.addClass( 'added-micro');
    return q;
}, 'µ addClass', true );

time( function()
{
    return $( 'div.speed' );
},
function( q )
{
    q.addClass( 'added-jquery');
    return q;
}, '$ addClass', true );

// REMOVE CLASS
time( function()
{
    return native( 'div.added-native' );
},
function( q )
{
    var cls = 'added-native';
    for (var i = 0; i < q.length; i++)
    {
        q[i].classList.remove( cls );
    }
    return q;
}, 'native removeClass', true );

time( function()
{
    return µ( 'div.added-micro' );
},
function( q )
{
    q.removeClass( 'added-micro' );
    return q;
}, 'µ removeClass', true );

time( function()
{
    return $( 'div.added-jquery' );
},
function( q )
{
    q.removeClass( 'added-jquery' );
    return q;
}, '$ removeClass', true );
