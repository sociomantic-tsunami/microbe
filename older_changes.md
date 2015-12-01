Older changes
=============

This is truncated from the readme file to keep down the size

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