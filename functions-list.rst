**µ.js**

**Microbe Constructor**

    Either selects or creates an HTML element and wraps in into an Microbe instance
    
    µ('div#test')   ---> selection

    µ('<div#test>') ---> creation
    
    @param   {Element or String} _selector           HTML selector

    @param   {Element}           _scope              scope to look inside

    @param   {Element or Array}  _elements           elements to fill Microbe with (optional)
        
    @return  {Microbe}
    
    µ( _selector, [ _scope, _elements ] )


**Add Class**

    Adds the passed class to the current element(s)

    @param   {String}            _class              class to add

    @return  {Microbe}

    µ(  ).addClass( _class )



**Append Element**

    appends an element or elements to the microbe.  if there is more than one target the next ones are cloned

    @param   {Element Array or Microbe}  _el           element(s) to append

    @return  {Microbe}

    µ(  ).append( _el )



**Attribute**

    Changes the attribute by writing the given property and value to the supplied elements. (properties should be supplied in javascript format). If the value is omitted, simply returns the current attribute value of the element.
 
    @param   {String}            _attribute          attribute name

    @param   {String}            _value              attribute value (optional)

    @return  {Microbe or Array}


    µ(  ).attr( _attribute, [ _value ] )


**Get Children**

    gets an array of all the given elements children
 
    @return {Array}                                  array of microbes

    µ(  ).children()


**CSS**

    Changes the CSS by writing the given property and value inline to the supplied elements. (properties should be supplied in javascript format).  If the value is omitted, simply returns the current css value of the element.

    @param   {String}            _attribute          css property

    @param   {String}            _value              css value (optional)
  
    @return  {Microbe or Array}
 
    µ(  ).css( _property, [ _value ] )



**Each**

    iterates through all the elements an execute the function on each of them
   
    @param  {Function}           _callback           function to apply to each item
    
    @return {Array}

    µ(  ).each( _callback )


**First Element**
  
    Methods gets the first HTML Elements of the current object, and wrap it in Microbe.
   
    @return  {Microbe}

    µ(  ).first()


**Get Parent Index**

    gets the index of the item in it's parentNode's children array
   
    @return {Array}                       array of indexes

    µ(  ).getParentIndex()


**Has Class**

    Checks if the current object or the given element has the given class
   
    @param   {String}            _class              class to check
    
    @return  {Microbe}

    µ(  ).hasClass( _class )


**HTML**

    Changes the innerHtml to the supplied string.  If the value is omitted, simply returns the current inner html value of the element.
    
    @param   {String}            _value              html value (optional)
    
    @return  {Microbe or Array}

    µ(  ).html( [ _value ] )


**Index of**

    returns the index of an element in this microbe
    
    @param {Element}             _el                 element to check 
    
    @return {Number}

    µ(  ).indexOf( _el )



**Insert After**

    Inserts the given element after each of the elements given (or passed through this). if it is an elemnet it is wrapped in a microbe object.  if it is a string it is created
    
    @example µ( '.elementsInDom' ).insertAfter( µElementToInsert )
    
    @param  {Object or String}   _elAfter            element to insert
    
    @return {Microbe}
 
    µ(  ).insertAfter( _elAfter )


**Last Element**

    Gets the last HTML Elements of the current object, and wrap it in Microbe.
  
    @return  {Microbe}
 
    µ(  ).last()



**Map**

    native map function

    @param  {Function}           callback            function to apply to all element
    
    @return {Array}                                  array of callback returns  

    µ(  ).map( callback )



**Parent**

    sets all elements in µ to their parent nodes
   
    @return {Microbe}

    µ(  ).parent()


**Push element**
     
    adds a new element to a microbe
   
    @param  {Element}            _el                 element to add
     
    @return {Microbe}                            

    µ( ).push( element )


**Remove Element**

    removes an element or elements from the dom
   
    @return {Microbe}
 
    µ(  ).remove()



**Remove Class**

    Method removes the given class from the current object or the given element.
   
    @param   {String}            _class              class to remove
    
    @return  {Microbe}

    µ(  ).removeClass( _class )


**Selector**

    returns the css selector from an element

    @return {String}                                  combined selectors

    µ(  ).selector()



**Splice**

    native splice wrapped in a microbe
     
    @return {Microbe}                                  

    µ(  ).splice( _start, _end )



**Text**
  
    Changes the inner text to the supplied string. If the value is omitted, simply returns the current inner html value of the element.

    @param   {String}            _value              Text value (optional)
    
    @return  {Microbe or Array}

    µ(  ).text( [ _value ] )



**Toggle Class**

    Methods calls removeClass on the current object.

    @param   {String}            _class              class to add
    
    @return  {Microbe}

    µ(  ).toggleClass( _class )



**Extend**

    extends a microbe, object, or array with as many objects or arrays as are passed

    @return {Object}

    µ.extend( obj1, obj2, [ obj3, ... ] )

    µ(  ).extend( obj1, [ obj2, obj3, ... ] )


**Merge**
 
    combines microbes or array elements.

    @param  {Object or Array}        first               first array or array-like object
    @param  {Object or Array}        second              second array or array-like object
 
    @return {Object or Array}                            combined arr or obj (based off first)

    µ.merge( _obj, _obj2 )

    µ(  ).merge( _obj )


**Capitalize String**
 
    capitalizes every word in a string or an array of strings and returns the type that it was given
 
    @param  {String or Array}        text                string(s) to capitalize
 
    @return {String or Array}                            capitalized string(s)

    µ.capitalize( _strings )

    µ.capitalise( _strings )


**Identify**
 
    returns itself if a value needs to be executed

    @param  {any}                    value               any value
 
    @return {value}

    µ.identify( value )



**nothing happens**

    https://en.wikipedia.org/wiki/Xyzzy_(computing)

    @return {void}

    µ.noop()

    µ.xyzzy();


 **isArray**

    checks if the passed object is an array
 
    @param {Object}

    @return {Boolean}

    µ.isArray( prop )


**isEmpty**
 
    checks if the passed object is empty
 
    @param  {Object}                 obj                 object to check
 
    @return {Boolean}                                    empty or not
 
    µ.isEmpty( obj )


**isFunction**
 
    checks if the passed parameter is a function
 
    @param  {Object}                 obj                 object to check
 
    @return {Boolean}                                    function or not

    µ.isFunction( obj )


**isUndefined**
 
    @param  {String}                obj                 property

    @param  {Object}                parent              object to check
 
    @return {Boolean}                                    obj in parent

    µ.isUndefined( obj, parent )


**isWindow**
 
    checks if the passed parameter equals window

    @param  {Object}                 obj                 object to check
 
    @return {Boolean}                                    isWindow or not

    µ.isWindow( obj )


**To String**
 
    Methods returns the type of Microbe.
 
    @return  {String}

    µ.toString()
    µ(  ).toString()


**To array**
 
    Methods returns all the elements in an array.
 
    @return  {Array}

    µ.toArray( obj )
    µ(  ).toArray()


**Type of**
 
    returns the type of the parameter passed to it
 
    @param  {all}                    obj                 parameter to test
 
    @return {String}                                     typeof obj
 
    µ.type( obj )


**Ready**

    sets a function to run on window load

    @param   {Function}             _cb                  callback to run on load

    @return  {void}

    µ.ready( _cb )



**Emit event**
     
    emits a custom event to the HTMLElements of the current object
    
    @param   {String}            _event              HTMLEvent

    @param   {Object}            _data               event data

    @param   {Boolean}           _bubbles            event bubbles?

    @param   {Boolean}           _cancelable         cancelable?
    
    @return  {Microbe}

    µ(  ).emit( _event, _data, [ _bubbles, _cancelable ] )


**Bind Events**
     
    Binds an event to the HTMLElements of the current object or to the given element.
    
    @param   {String}            _event              HTMLEvent

    @param   {Function}          _callback           callback function
     
    @return  {Microbe}

    µ(  ).on( _event, _callback )



**Unbind Events**
     
    unbinds an event.  If no event is supplied it will unbind all events
    
    @param   {String}            _event                  event name

    @param   {Function}          _callback               callback function

    @param   {Object}            _el                     HTML element to modify 
     
    @return  {Microbe}
    
    µ(  ).off = function( [ _event, _callback ] )


**Get data**
    
    gets the saved value from each element in the microbe in an array
     
    @param  {String}             _prop               property to get

    @return {Array}                                  array of values

    µ(  ).get( prop )


**Observe**
     
    applies a function to an element if it is changed from within microbe
     
    @param  {Function}           function            function to apply

    @param  {String}             _prop               property to observe

    @param  {Boolean}            _once               bool to trigger auto unobserve
     
    @return {Microbe}
   
    µ(  ).observe( prop, func, [ _once ] )


**Observe Once**
     
    applies a function to an element if it is changed from within µ (once)
     
    @param  {Function}           func                function to apply

    @param  {String}             _prop               property to observe
    
    @return {Microbe}
    
    µ(  ).observeOnce( func, _prop )


**Set data**
     
    sets the value to the data object in the each element in the microbe 
     
    @param  {String}             prop                property to set

    @param  {String}             value               value to set to
     
    @return {Microbe}

    µ(  ).set( prop, value )
    


**Stop observing**
     
    stops watching the data changes of a microbe
     
    @param   {String}            _prop               property to stop observing
    
    @return  {Microbe}

    µ(  ).unobserve( _prop )



**http**

    @param {Object}             _parameters          http parameters. possible properties                                         
                                                     method, url, data, user, password, headers, async

    @param {Function}           _cbThen              function to call after success

    @param {Function}           _cbCatch             function to call on error

    µ.http( _parameters )
   
    µ.http.get( _url )

    µ.http.post( _url, _data )


                              .then( _cb )

                              .catch( _cb )