µ - Microbe - 0.4.13
====================

[![Microbe build status](https://travis-ci.org/sociomantic/microbe.svg)](https://travis-ci.org)  [![Slack Status](https://microbejs-slackin.herokuapp.com/badge.svg)](https://microbejs-slackin.herokuapp.com)


microbe is a javascript library to aid in DOM manipulation as well as facilitating events, object observation, and data binding. It uses the micro character ( µ ) that is accessible in:

+ osx: alt-m
+ windows: alt+0181
+ linux: alt gr+m or alt+230

microbe aims to be modular and expandable. It’s separated into several modules:

+ Selector engine with CSS4 selector support and base functions (find, filter, siblings, children, … )

+ Core helpers (class, extend, text, attributes … )

+ DOM helpers (append, appendTo, insertAfter, prepend … )

+ Type helpers(isUnidentified, isArray, isWindow, … )

+ HTTP helpers making use of Promises (get, post, … )

+ Object.observe watches objects for changes. It can also watch itself for changes in element get/set data

+ Events - binding and emitting custom events

+ See the full list [in the docs](http://m.icro.be/doc)


microbes are always array-like for consistency and can be extended and merged very easily.


Don’t hesitate to file issues and features requests! Or change things yourself and send a pull request.



Usage
=====

- `npm i --S microbejs`

    or

- `bower install -S microbejs`

	or

- `<script src="./microbe.js"></script>`


Example use
===========


```javascript
// all divs on the page
var µDivs = µ( 'div' ) ;

// create a div with the class example--class
var newDiv = µ( '<div.example--class>' );

// all divs get a newDiv or a clone of newDiv inserted into the DOM after them
µDivs.insertAfter( newDiv );

// watches the class of each div
µDivs.observe( 'class', function( e )
{
    console.log( 'your class changed' );
} );

// gives the class example--class to each div also triggers the observe fuctions
µDivs.addClass( 'example--class' );

// sets a custom event watch
µDivs.on( 'toTheMoon', function( e )
{
    console.log( e.detail );
} );

// emits a custom event to all elements in µDivs with a custom data packet.
// triggers the event listener to show the sent data
µDivs.emit( 'toTheMoon', { moon : 'close' } );
```


Dev Installation
================

-  Clone repo
-  Make sure node and npm is installed
- `npm install`
- `npm start`


Compiling the dist files
========================

- microbe.js                    `npm run gulp` or `npm run microbe`
- microbe.selectorEngine.js     `npm run selectorEngine`
- microbe.toolkit.js            `npm run toolkit`


Generating www docs
===================

- `npm run docs`
(this command will watch for changes)


Contributing
============

We gladly accept and review any pull-requests. Feel free! :heart:

Otherwise, if you just want to talk, we are very easy to get a hold of!

+ Slack:          [microbejs.slack.com](https://microbejs.slack.com)[![Slack Status](https://microbejs-slackin.herokuapp.com/badge.svg)](https://microbejs-slackin.herokuapp.com)
+ Twitter:        [@microbejs](https://www.twitter.com/microbejs)
+ Email:          [hello@m.icro.be](hello@m.icro.be)
+ Web:            [http://m.icro.be](http://m.icro.be/)
+ Git:            [https://github.com/sociomantic/microbe/](https://github.com/sociomantic/microbe/)
+ IRC ([freenode](https://kiwiirc.com/client/chat.freenode.net:+6697/#microbe)): #microbe



This project adheres to the [Contributor Covenant](http://contributor-covenant.org/). By participating, you are expected to honor this code.

[Microbe - Code of Conduct](https://github.com/sociomantic/microbe/blob/master/CODE_OF_CONDUCT.md)

Need to report something? [report@m.icro.be](report@m.icro.be)


Change log
==========

#### 0.4.13

+ added travi-ci testing
+ added nightmare command line testing
+ removed gitter


#### 0.4.12

+ added appendTo and prependTo
+ aliased each to forEach for array compatability
+ added slack community to readme and www


#### 0.4.11

+ children, childrenFlat, siblings, siblingsFlat now all accept filter strings
+ changes to siblings, siblingsFlat, filter, and find using + and ~


#### 0.4.10

+ selectorEngine now accepts functions as "document ready" short hand


#### 0.4.9

+ added bower support
+ µ.ready now accepts an arguments array
+ added examples to docs
+ updated code of conduct
+ toggleClass now accepts an array of classes
+ twitter account added to info


#### 0.4.8

+ updated copy and tests


#### 0.4.7

 + updated readme with how to use the µ symbol
 + copy and logo changes on ./www
 + regenerated doc
 + updated gulpfile


#### 0.4.6

+ moved functions and structure to enable modular building


#### 0.4.5

+ updated remove
+ core and dom now check before they use something from a different module
+ updated readme, gulpfile, tests, docs, and comments
+ selectorEngine utils split into core and root
+ cytoplasm now accepts html strings for element creation (single or multiple elements)
+ selector strings of multiple classes are now 10x faster
+ code cleaned of unused variables
+ many push replaces with null -> filter
+ iteration abstracted
+ changed internal structure to allow for closed array.prototype use
+ added contact info to readme


#### 0.4.2

+ upgraded tests
+ fixed bugs with setting falsey values into text/html
+ fixed bugs with selection by id
+ updated copy on site and readme
+ added code of conduct and contact email


#### 0.4.1

+ cross browser compatability fixes


#### 0.4.0

+ namespace bug fixed in Observe Utils shim
+ selector engine abstracted
+ modular building now supported
+ fixed a bug in find that left illegal whitespace


#### 0.3.9

+ speed fixes
+ automated version scaling in static pages
+ append and prepend now accept html
+ prepend tweaks and docs
+ custom nth selectors now support 'even' and 'odd' keywords
+ .root() removed; :root simplified


#### 0.3.8

+ many more comparative speed test
+ children and siblings speed fixes
+ init support for HTML collections
+ pseudo selector speed improvements
+ fixed an issue in .match() that incorrectly detected forms as arrays


#### 0.3.7

+ speed fixes
+ extend updated
+ upgrades to .off() event removal
+ updated gulp file for inclusion of liscence


#### 0.3.4

+ small bug fixes
+ updated documantation and tests
+ speed updates
+ added filter by function
+ updated find to include elements not in the dom


#### 0.3.3

+ more consistent documentation
+ more consistent output
+ updated filter method
+ updated find method
+ support for css4 selectors
+ µ.matches for css selector matching
+ depreciated selector generation
+ fixed a bug in microbe creation when the scope was a microbe
+ many core speed fixes


#### 0.3.2

+ added debounce
+ added insertStyle
+ added once
+ added poll
+ added prepend
+ added removeStyle
+ added removeStyles
+ addClass now accepts className strings
+ removeClass now accepts className strings and arrays
+ attr now accepts objects
+ html now accepts microbes
+ many documentation updates


#### 0.3.1

+ added pseudo selector support
+ added filter function
+ added find function
+ many documentation updates


No one should be using less than 0.3  Changes past that will be posted here.

