Older changes
=============

This is truncated from the readme file to keep down the size

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
+ microbe selector engine now accepts html strings for element creation (single or multiple elements)
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


No one should be using less than 0.3.
