µ - Microbe - 0.4.17
====================

[![Microbe build status](https://travis-ci.org/sociomantic/microbe.svg)](https://travis-ci.org)  [![Slack Status](https://microbejs-slackin.herokuapp.com/badge.svg)](https://microbejs-slackin.herokuapp.com)

(for modern browsers and ie10+)

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

- `npm i -S microbejs`

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
- `npm build`



Running the tests
=================

From the command line:

```
npm run test
```

From the browser

```
http://m.icro.be/tests
http://localhost/microbe/tests
```


Available npm scripts
=====================

+ build `builds all 3 standard microbe versions, then builds and runs tests`
+ buildTests `builds the tests`
+ deploy `bumps the minor version, runs build, then builds docs` 
+ docs `builds the docs.  rebuilds the docs everytime a file changes`
+ docsOnce `build docs once`
+ gulp `builds microbe`
+ microbe `builds microbe`
+ selectorEngine `builds the microbe selector engine`
+ toolkit `builds microbe toolkit`
+ test `runs the test suite in nightmare`


Contributing
============

We gladly accept and review any pull-requests. Feel free! :heart:

Otherwise, if you just want to talk, we are very easy to get a hold of!

+ Slack:          [microbejs.slack.com](https://microbejs.slack.com)
+ Twitter:        <a href="https://www.twitter.com/microbejs" target="_blank">@microbejs</a>
+ Email:          [hello@m.icro.be](hello@m.icro.be)
+ Web:            <a href="http://m.icro.be/" target="_blank">http://m.icro.be/</a>
+ Git:            <a href="https://github.com/sociomantic/microbe/" target="_blank">https://github.com/sociomantic/microbe/</a>
+ IRC             <a href="https://kiwiirc.com/client/chat.freenode.net:+6697/#microbe">freenode #microbe</a>



This project adheres to the [Contributor Covenant](http://contributor-covenant.org/). By participating, you are expected to honor this code.

[Microbe - Code of Conduct](https://github.com/sociomantic/microbe/blob/master/CODE_OF_CONDUCT.md)

Need to report something? [report@m.icro.be](report@m.icro.be)


Change log
==========

#### 0.4.18

+ automated version bumps to stop needing to jump multiple minor versions
+ tweaked test css
+ readme updates
+ removed watch script from package.json


#### 0.4.16

+ fixed global constructor leak with pseudo


#### 0.4.15

+ text() : changed innetText to textContent to avoid reflow
+ added .height() and .width() syntactic sugar
+ added .scroll()
+ pageStyles split from main root tools
+ added top and left to scroll(), position(), and offset()
+ fixed local-link
+ fixed Win 10 IE 11 and Edge :lang


#### 0.4.14

+ css now accepts objects
+ truncated older chanes log outto a seperate file
+ gulpfile changes
+ added position
+ added offset
+ added isMicrobe
+ made isMicrobe, version, and type read-only
+ added includes


#### 0.4.13

+ added travis-ci testing
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


Older Changes
=============

To keep the length of this file down, [older changes are here](./older_changes.md)
