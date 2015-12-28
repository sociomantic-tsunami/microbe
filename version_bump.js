// minor version update script
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
        return console.log( err );
    } );
}


function updateLine( url, ln, replacement )
{
    var data            = getResource( url );
    var dataSplit       = data.split( '\n' );
        dataSplit[ ln ] = replacement;

    return dataSplit.join( '\n' );
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


var newVersion      = process.argv[2] || updateVersion( versionUrl );

var versionScript   = 'module.exports = \'' + newVersion + '\';';
setResource( versionUrl, versionScript );

var readme          = updateLine( readmeUrl, 0, 'µ - Microbe - ' + newVersion );
setResource( readmeUrl, readme );

var packageJSON     = updateLine( packageUrl, 2, '  "version": "' + newVersion + '",' );
setResource( packageUrl, packageJSON );
