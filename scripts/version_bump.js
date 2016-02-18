/**
 * ## version_bump.js
 *
 * Node script that bumps the version in the appropriate spots
 *
 * @author  Mouse Braun         <mouse@knoblau.ch>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@gmail.com>
 *
 * @package Microbe
 */
var fs              = require( 'fs' );

/**
 * ## getResource
 *
 * reads and returns a url after decoding it
 *
 * @param {String} url target
 *
 * @return {String} decoded data
 */
function getResource( url )
{
    var _d = fs.readFileSync( url );
    return _d.toString( 'utf8', 0, _d.length );
}


/**
 * ## setResource
 *
 * overwrites a resource
 *
 * @param {String} url target
 *
 * @return {String} decoded data
 */
function setResource( url, data )
{
    fs.writeFile( url, data, function ( err )
    {
        if ( err )
        {
            console.log( err );
        }
    } );
}


/**
 * ## updateLine
 *
 * updates a specific line with the given replacement
 *
 * @param {String} url url to find the resource
 * @param {Number} ln line number
 * @param {String} replacement replacement text
 *
 * @return _Void_
 */
function updateLine( url, ln, replacement )
{
    var data            = getResource( url );
    var dataSplit       = data.split( '\n' );
        dataSplit[ ln ] = replacement;
        data            = dataSplit.join( '\n' );

    setResource( url, data );

    console.log( url + ' successfully changed' );
}


/**
 * ## updateVersion
 *
 * grabs the version file, parses, and updates the minor version
 *
 * @param {String} url target
 *
 * @return {String} updated version string
 */
function updateVersion( url )
{
    var version         = getResource( versionUrl );
    var versionSplit    = version.split( '.' );
    versionSplit.shift();
    versionSplit[0]     = parseInt( versionSplit[0].split( '\'' )[1] );

    var newVersion      = parseInt( versionSplit[2] ) + 1;
        versionSplit[2] = newVersion;
    return versionSplit.join( '.' );
}


var readmeUrl       = './README.md';
var versionUrl      = './src/version.js';
var packageUrl      = './package.json';
var bowerUrl        = './bower.json';

var newVersion      = process.argv[ 2 ] || updateVersion( versionUrl );

updateLine( versionUrl, 0, 'module.exports = \'' + newVersion + '\';' );
updateLine( readmeUrl, 0, 'µ - Microbe - ' + newVersion );
updateLine( packageUrl, 2, '  "version": "' + newVersion + '",' );
updateLine( bowerUrl, 2, '    "version": "' + newVersion + '",' );
