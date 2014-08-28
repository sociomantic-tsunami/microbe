Microbe
=======

Microbe, or µ, is a javascript framework…

Another JS framework, really… ?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Microbe is born from a trip in Hamburg where someone showed simple
shortcuts everyday functions, such as querySelector or querySelectorAll.
So why not go further and make better and learn how this
``<insert JS framework here>`` magic works ?

It is being developed as both an ongoing learning experiment, as well as
something to use internally once its speed has been tweaked. The goal
being to write an efficent library in both ES5 and ES6 to be ready for
the future. The ES6 version is already usable through
`traceur-compiler`_ (included in our gulpfile).

Microbe, which is aiming to be somewhat general and expendable as wish,
is separated into several categories:
- CSS helpers (add classes, change style, … )
- Events helpers (bind DOM events, unbind, … )
- HTML helpers, *aka a DOM manipulation that might be split even more in the
future* (selectors, attributes, … )
- HTTP helpers making use of Promises (get, post, … )
- Generalistic helpers (iterator, each, … )

And more to come. Don’t hesitate to file an issue for features that
you’d like to see.

Installation
~~~~~~~~~~~~

-  Clone repo
-  Make sure node && npm are installed
-  Make sure bower is installed (``$ npm install -g bower``)
-  Make sure gulp is installed (``$ npm install -g gulp``)
-  Run ``npm install .``
-  Run ``bower install .``
-  Run ``gulp`` (``gulp closure`` to minify with google-closure
   compiler, java 1.7+ required)
-  Go to tests/index.html to run the tests.

Contributing
~~~~~~~~~~~~

We gladly accept and review any pull-requests. Feel free! :heart:

.. _traceur-compiler: https://github.com/google/traceur-compiler
