Microbe - 0.3.1
===============

Microbe (µ) - a javascript library

Microbe is a javascript library to aid in DOM manipulation as well as facilitating
events, object observation, and data binding.

The next goal being to convert the library to ES6 to be ready for the future.

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

0.3.1
~~~~~

+ added pseudo selector support
+ added filter function
+ added find function
+ many documentation updates


No one should be using less than 0.3.  Changes past that will be posted here.


Usage
=====

- include microbe.js or microbe.min.js
- that's it!


Example use
===========

.. code:: javascript

    // all divs on the page
    var µDivs = µ( 'div' ) ;

    // create a div with the class anotherDiv
    var newDiv = µ( '<div.example--class>' );

    // all divs get a newDiv or a clone of newDiv inserted into the DOM after them
    µDivs.insertAfter( newDiv );

    // watches the class of each div
    µDivs.observe( 'class', function( e )
    {
        console.log( 'your class changed' );
    } );

    // gives the class aClass to each div also triggers the observe fuctions
    µDivs.addClass( 'example--class' );

    // sets a custom event watch
    µDivs.on( 'toTheMoon', function( e )
    {
        console.log( e.detail );
    } );

    // emits a custom event to all elements in µDivs with a custom data packet.
    // triggers the event listener to show the sent data
    µDivs.emit( 'toTheMoon', { moon : 'close' } );


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
