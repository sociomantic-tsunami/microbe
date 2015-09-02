µ - Microbe - 0.4.2
===================

microbe is a javascript library to aid in DOM manipulation as well as facilitating events, object observation, and data binding.

microbe aims to be modular and expandable. It’s separated into several modules:

+ Selector engine with CSS4 selector support and base functions (find, filter, siblings, children, … )

+ Core helpers (class, extend, text, attributes … )

+ DOM helpers (append, insertAfter, prepend … )

+ Type helpers(isUnidentified, isArray, isWindow, … )

+ HTTP helpers making use of Promises (get, post, … )

+ Object.observe watches objects for changes. It can also watch itself for changes in element get/set data

+ Events - binding and emitting custom events

+ See the full list [in the docs](http://m.icro.be/doc)


microbes are always array-like for consistency and can be extended and merged very easily.


Don’t hesitate to file issues and features requests! Or change things yourself and send a pull request.



Usage
=====

- `require( 'microbejs' );`
    or
- include microbe.js or microbe.min.js in a script tag


Example use
===========


```javscript
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
-  Make sure npm is installed
- `npm install`
- `npm start`


Generating www docs
===================

- `npm run docs`
(this command will watch for changes)


Contributing
============

We gladly accept and review any pull-requests. Feel free! :heart:


This project adheres to the [Open Code of Conduct](http://todogroup.org/opencodeofconduct/#microbe.js/abuse@m.icro.be). By participating, you are expected to honor this code.

[http://m.icro.be/code-of-conduct/](http://m.icro.be/code-of-conduct/)

Need to report something? [abuse@m.icro.be](abuse@m.icro.be)


Change log
==========

0.4.2
~~~~~

+ upgraded tests
+ fixed bugs with setting falsey values into text/html
+ fixed bugs with selection by id
+ updated copy on site and readme
+ added code of conduct and contact email


0.4.1
~~~~~

+ cross browser compatability fixes


0.4.0
~~~~~

+ namespace bug fixed in Observe Utils shim
+ selector engine abstracted
+ modular building now supported
+ fixed a bug in find that left illegal whitespace


0.3.9
~~~~~

+ speed fixes
+ automated version scaling in static pages
+ append and prepend now accept html
+ prepend tweaks and docs
+ custom nth selectors now support 'even' and 'odd' keywords
+ .root() removed; :root simplified


0.3.8
~~~~~

+ many more comparative speed test
+ children and siblings speed fixes
+ init support for HTML collections
+ pseudo selector speed improvements
+ fixed an issue in .match() that incorrectly detected forms as arrays


0.3.7
~~~~~

+ speed fixes
+ extend updated
+ upgrades to .off() event removal
+ updated gulp file for inclusion of liscence


0.3.4
~~~~~

+ small bug fixes
+ updated documantation and tests
+ speed updates
+ added filter by function
+ updated find to include elements not in the dom


0.3.3
~~~~~

+ more consistent documentation
+ more consistent output
+ updated filter method
+ updated find method
+ support for css4 selectors
+ µ.matches for css selector matching
+ depreciated selector generation
+ fixed a bug in microbe creation when the scope was a microbe
+ many core speed fixes


0.3.2
~~~~~

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


0.3.1
~~~~~

+ added pseudo selector support
+ added filter function
+ added find function
+ many documentation updates


No one should be using less than 0.3  Changes past that will be posted here.

