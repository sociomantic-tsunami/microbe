Microbe - 0.3
=============

Microbe (µ) - a javascript library

Microbe is a javascript library to aid in DOM manipulation as well as facilitating
events, object observation, and data binding, the goal being to write an efficent
library in ES6 to be ready for the future. Due to the nature
of it's development, Microbe is only using ES6 functionality that can be
shimmed.

Microbe aims to be somewhat general and expandable.  It's separated
into several categories:

+ Core helpers (iterator, each, … )

- DOM helpers such as appending and removing things from the DOM, getting parents and children, and class, attribute, and css manipulation,

+ Types (isUnidentified, isArray, isWindow, etc)

- HTTP helpers making use of Promises (get, post, … )

+ Object Observe watches objects for changes.  It can also watch itself for changes in element get/set data

- Events binding and emitting custom events

+ See the full list in the wiki https://github.com/sociomantic/microbe/wiki

Microbes are always array like for consistency and can be extended and merged very easily.


Don’t hesitate to file issues and features requests!  Or change things yourself and send a pull request.


Changelog
=========

No one should be using less than 0.3.  Changes past that will be posted here


Usage
=====

- include microbe.js or microbe.min.js
- that's it!


Example use
===========
.. code:: javascript

    var µDivs = µ( 'div' )                  // all divs on the page

    var newDiv = µ( '<div.example--class>' )// create a div with the class anotherDiv

    µDivs.insertAfter( newDiv )             // all divs get a newDiv or a clone of
                                            // newDiv inserted into the DOM after them

    µDivs.observe( 'class', function( e ){ console.log( 'your class changed' ); } );
                                            // watches the class of each div


    µDivs.addClass( 'example--class' )      // gives the class aClass to each div
                                            // also triggers the observe fuctions


    µDivs.on( 'toTheMoon', function( e ){ console.log( e.detail ); } );
                                            // sets a custom event watch

    µDivs.emit( 'toTheMoon', { moon : 'close' } );
                                            // emits a custom event to all elements in µDivs
                                            // with a custom data packet.  triggers the
                                            // event listener to show the sent data


Dev Installation
================

-  Clone repo
-  Make sure npm is installed
-  npm install
-  gulp


Contributing
============

We gladly accept and review any pull-requests. Feel free! :heart:


History
=======

Microbe was born JSUnconf in 2014 from a simple shortcut.::

    $   = document.querySelector;
    $$  = document.querySelectorAll;

So why not go further and make better and learn exactly how this <insert JS framework here> magic works ?

Microbe is being developed as both an ongoing learning experiment, as well as something actively used in projects.
