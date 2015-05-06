Microbe - 0.3
=============

Microbe (µ) - a javascript library

Microbe was born JSUnconf in 2014 from a simple shortcut.::

    $   = document.querySelector;
    $$  = document.querySelectorAll;


So why not go further and make better and learn exactly how this::

    <insert JS framework here>

magic works ?

Microbe is being developed as both an ongoing learning experiment, as well as
something actively used in projects. The goal being to write an efficent
library in ES6 to be ready for the future. Due to the nature
of it's development, Microbe is only using ES6 functionality that can be
shimmed.

Microbe, which is aiming to be somewhat general and expandable, is separated
into several categories:

+ Core helpers (iterator, each, … )

- DOM helpers, aka a DOM manipulation that might be split even more in the future (selectors, attributes, … )

+ HTTP helpers making use of Promises (get, post, … )

- Observe ( observe, get, set, … )

+ Events binding and custom events ( on, off, emit )


Don’t hesitate to file issues and features requests!  Or change things yourself and send a pull request.

**Usage**::

    - include microbe.js or microbe.min.js
    - that's it!

**Dev Installation**::

    -  Clone repo
    -  Make sure npm is installed
    -  Run 'npm install'


**Contributing**

We gladly accept and review any pull-requests. Feel free! :heart:
