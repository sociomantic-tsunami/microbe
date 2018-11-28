NOTE
====

This project is not maintained anymore and it's archived.

µ - Microbe - 0.5.2
====================

[![Microbe build status](https://travis-ci.org/sociomantic-tsunami/microbe.svg)](https://travis-ci.org)  [![Slack Status](https://microbejs-slackin.herokuapp.com/badge.svg)](https://microbejs-slackin.herokuapp.com)

(for modern browsers and ie10+)

microbe is a javascript library to aid in DOM manipulation aimed at speed and consistency as well as facilitating events, and data binding. It uses the micro character ( µ ) that is accessible in:

+ osx: alt + m
+ windows: alt + 0181
+ linux: alt gr + m or alt + 230

microbe aims to be modular and expandable. It’s separated into several modules:

+ Selector engine with CSS4 selector support and base functions (find, filter, siblings, children, … )

+ Core helpers (class, extend, text, attributes … )

+ DOM helpers (append, appendTo, insertAfter, prepend … )

+ Type helpers(isUnidentified, isArray, isWindow, … )

+ HTTP helpers making use of Promises (get, post, … )

+ Data that is retrievable through the DOM. (get/set)

+ Events - binding and emitting custom events

+ See the full list [in the docs](http://m.icro.be/doc)


microbes are always array-like for consistency and can be extended and merged very easily.


Don’t hesitate to file issues and features requests! Or change things yourself and send a pull request.



Usage
=====

- `npm i -D microbejs`

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

// gives the class example--class to each div
µDivs.addClass( 'example--class' );

// all divs get a newDiv or a clone of newDiv inserted into the DOM after them
µDivs.insertAfter( newDiv );

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

+ `npm run build` builds all 4 standard microbe versions, then builds and runs tests
+ `npm run buildTests` builds the tests
+ `npm run deploy` bumps the minor version, runs build, then builds docs
+ `npm run docs` builds the docs.  rebuilds the docs everytime a file changes
+ `npm run docsOnce` build docs once
+ `npm run gulp` builds microbe
+ `npm run http` builds microbe http
+ `npm run microbe` builds microbe
+ `npm run selectorEngine` builds the microbe selector engine
+ `npm run toolkit` builds microbe toolkit
+ `npm test` runs the test suite in nightmare


Contributing
============

We gladly accept and review any pull-requests. Feel free! :heart:

Otherwise, if you just want to talk, we are very easy to get a hold of!

+ Slack:          [microbejs.slack.com](https://microbejs.slack.com)
+ Twitter:        <a href="https://www.twitter.com/microbejs" target="_blank">@microbejs</a>
+ Email:          [hello@m.icro.be](mailto:hello@m.icro.be)
+ Web:            <a href="http://m.icro.be/" target="_blank">http://m.icro.be/</a>
+ Git:            <a href="https://github.com/sociomantic-tsunami/microbe/" target="_blank">https://github.com/sociomantic-tsunami/microbe/</a>
+ IRC             <a href="https://kiwiirc.com/client/chat.freenode.net:+6697/#microbe">freenode #microbe</a>



This project adheres to the [Contributor Covenant](http://contributor-covenant.org/). By participating, you are expected to honor this code.

[Microbe - Code of Conduct](https://github.com/sociomantic-tsunami/microbe/blob/master/CODE_OF_CONDUCT.md)

Need to report something? [report@m.icro.be](mailto:report@m.icro.be)


Change log
==========

### 0.5.2

+ added .value() and tests


### 0.5.1

+ readme updates
+ repo url update
+ updated version_bump script


### 0.5.0

+ observe is fully depreciated and removed
+ observe related speed fixes in addClass, removeClass, attr, html, text, on, off, set, get
+ all builds now have their own test page for testing encapsulation
+ package.json cleaned up


### 0.4.21

+ license spells
+ added seperate http build
+ gulp and package file changes


#### 0.4.20

+ fixed toolkit getter issue


#### 0.4.19

+ added bower to version_bump
+ removed cdnjs-importer from dependencies
+ small www changes


#### 0.4.18

+ automated version bumps to stop needing to jump multiple minor versions
+ tweaked test css
+ readme updates
+ removed watch script from package.json


#### 0.4.16

+ fixed global constructor leak with pseudo


Older Changes
=============

To keep the length of this file down, [older changes are here](./older_changes.md)
