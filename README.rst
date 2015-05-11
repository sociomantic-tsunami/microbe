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


Dev Installation
================

-  Clone repo
-  Make sure npm is installed
-  npm install
-  gulp


Dev Dependencies (taken care of by npm install)
===============================================

:Dependency: browserify     ^5.11.2
:Dependency: gulp           latest
:Dependency: gulp-rename    ^1.2.2
:Dependency: gulp-replace   ^0.4.0
:Dependency: gulp-rimraf    latest
:Dependency: gulp-uglify    ^1.2.0
:Dependency: observe-shim   ^0.4.1
:Dependency: observe-utils  ^0.3.2
:Dependency: promise        ^6.0.0
:Dependency: qunitjs        ^1.18.0
:Dependency: setimmediate   ^1.0.2


Contributing
============

We gladly accept and review any pull-requests. Feel free! :heart:


History
=======

Microbe was born JSUnconf in 2014 from a simple shortcut.::

    $   = document.querySelector;
    $$  = document.querySelectorAll;

So why not go further and make better and learn exactly how this::

    <insert JS framework here>

magic works ?

Microbe is being developed as both an ongoing learning experiment, as well as
something actively used in projects.