"use strict";
var Microbe = function Microbe(_selector) {
  var _scope = arguments[1] !== (void 0) ? arguments[1] : document;
  var _elements = arguments[2] !== (void 0) ? arguments[2] : null;
  var elements;
  if (_selector.nodeType === 1) {
    return this.create(_selector);
  } else if (/^<.+>$/.test(_selector)) {
    return this.create(_selector.substring(1, _selector.length - 1));
  } else if (Object.prototype.toString.call(_selector) === '[object NodeList]') {
    elements = _selector;
  } else if (_elements) {
    if (Array.isArray(_elements)) {
      elements = _elements;
    } else {
      elements = [_elements];
    }
  } else {
    elements = _scope.querySelectorAll(_selector);
  }
  this.length = elements.length;
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = elements.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    $traceurRuntime.setProperty(this, i, elements[$traceurRuntime.toProperty(i)]);
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  for (var $prop in $Microbe.prototype) {
    try {
      throw undefined;
    } catch (prop) {
      {
        prop = $prop;
        if ($Microbe.prototype.hasOwnProperty(prop)) {
          $traceurRuntime.setProperty(elements, prop, $Microbe.prototype[$traceurRuntime.toProperty(prop)]);
        }
      }
    }
  }
  return elements;
};
var $Microbe = Microbe;
($traceurRuntime.createClass)(Microbe, {
  each: function(_target, _callback) {
    if (typeof _target === 'function' && !_callback) {
      _callback = _target;
      _target = this;
    }
    var i = 0;
    for (var $__1 = this.iterator(_target)[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__2; !($__2 = $__1.next()).done; ) {
      try {
        throw undefined;
      } catch (item) {
        {
          item = $__2.value;
          {
            _callback(item, i++);
          }
        }
      }
    }
    return _target;
  },
  iterator: $traceurRuntime.initGeneratorFunction(function $__3() {
    var _iterable,
        nextIndex;
    var $arguments = arguments;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            _iterable = $arguments[0] !== (void 0) ? $arguments[0] : this;
            nextIndex = 0;
            $ctx.state = 7;
            break;
          case 7:
            $ctx.state = (nextIndex < _iterable.length) ? 1 : -2;
            break;
          case 1:
            $ctx.state = 2;
            return _iterable[$traceurRuntime.toProperty(nextIndex++)];
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 7;
            break;
          default:
            return $ctx.end();
        }
    }, $__3, this);
  }),
  micro: function(_obj) {
    if (_obj.type === '[object Microbe]') {
      if (/^<.+>$/.test(_obj)) {
        return this.create(_obj.substring(1, _obj.length - 1));
      } else {
        return new $Microbe(_obj);
      }
    }
    return _obj;
  },
  toArray: function() {
    var arr = [];
    for (var $__1 = this.iterator()[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__2; !($__2 = $__1.next()).done; ) {
      try {
        throw undefined;
      } catch (item) {
        {
          item = $__2.value;
          {
            arr.push(item);
          }
        }
      }
    }
    return arr;
  }
}, {});
Microbe.prototype.type = '[object Microbe]';
Microbe.prototype.append = function(_el, _parent) {
  var _append = function(_parentEl, _elm) {
    if (_elm) {
      _parentEl.appendChild(_elm);
    } else {
      _parentEl.appendChild(_el);
    }
  };
  if (_parent) {
    _append(_parent);
  }
  if (!_el.length) {
    _el = [_el];
  }
  {
    try {
      throw undefined;
    } catch ($leni) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $leni = this.length;
          }
          for (; $i < $leni; $i++) {
            try {
              throw undefined;
            } catch (leni) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    leni = $leni;
                  }
                  try {
                    {
                      try {
                        throw undefined;
                      } catch ($lenj) {
                        try {
                          throw undefined;
                        } catch ($j) {
                          {
                            {
                              $j = 0;
                              $lenj = _el.length;
                            }
                            for (; $j < $lenj; $j++) {
                              try {
                                throw undefined;
                              } catch (lenj) {
                                try {
                                  throw undefined;
                                } catch (j) {
                                  {
                                    {
                                      j = $j;
                                      lenj = $lenj;
                                    }
                                    try {
                                      if (i !== 0) {
                                        _append(this[$traceurRuntime.toProperty(i)], _el[$traceurRuntime.toProperty(j)].cloneNode(true));
                                      } else {
                                        _append(this[$traceurRuntime.toProperty(i)], _el[$traceurRuntime.toProperty(j)]);
                                      }
                                    } finally {
                                      $j = j;
                                      $lenj = lenj;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  } finally {
                    $i = i;
                    $leni = leni;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return this;
};
Microbe.prototype.attr = function(_attribute, _value, _el) {
  var _setAttr;
  var _getAttr;
  var _removeAttr;
  _setAttr = function(_elm) {
    if (_value === null) {
      _removeAttr(_elm);
    } else {
      if (!_elm.getAttribute) {
        $traceurRuntime.setProperty(_elm, _attribute, _value);
      } else {
        _elm.setAttribute(_attribute, _value);
      }
    }
  };
  _getAttr = function(_elm) {
    if (_elm.getAttribute(_attribute) === null) {
      return _elm[$traceurRuntime.toProperty(_attribute)];
    }
    return _elm.getAttribute(_attribute);
  };
  _removeAttr = function(_elm) {
    if (_elm.getAttribute(_attribute) === null) {
      delete _elm[$traceurRuntime.toProperty(_attribute)];
    } else {
      _elm.removeAttribute(_attribute);
    }
  };
  if (_value !== undefined) {
    if (_el) {
      _setAttr(_el);
      return this;
    }
    {
      try {
        throw undefined;
      } catch ($len) {
        try {
          throw undefined;
        } catch ($i) {
          {
            {
              $i = 0;
              $len = this.length;
            }
            for (; $i < $len; $i++) {
              try {
                throw undefined;
              } catch (len) {
                try {
                  throw undefined;
                } catch (i) {
                  {
                    {
                      i = $i;
                      len = $len;
                    }
                    try {
                      _setAttr(this[$traceurRuntime.toProperty(i)]);
                    } finally {
                      $i = i;
                      $len = len;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return this;
  }
  var attributes = [];
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    attributes.push(_getAttr(this[$traceurRuntime.toProperty(i)]));
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (attributes.length === 1) {
    return attributes[0];
  }
  return attributes;
};
Microbe.prototype.children = function(_el) {
  var _children = function(_elm) {
    return _elm.children;
  };
  var childrenArray = [];
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    childrenArray.push(_children(this[$traceurRuntime.toProperty(i)]));
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (childrenArray.length === 1) {
    return childrenArray[0];
  }
  return childrenArray;
};
Microbe.prototype.create = function(_el) {
  if (typeof _el === 'string') {
    try {
      throw undefined;
    } catch (_id) {
      try {
        throw undefined;
      } catch (original) {
        try {
          throw undefined;
        } catch (_class) {
          try {
            throw undefined;
          } catch (reElement) {
            try {
              throw undefined;
            } catch (reId) {
              try {
                throw undefined;
              } catch (reClass) {
                {
                  reClass = /\.([^.$#]+)/g;
                  reId = /#([^.$]+)/;
                  reElement = /[#.]/;
                  ;
                  original = _el;
                  _el = _el.split(reElement)[0];
                  _el = document.createElement(_el);
                  _id = original.match(reId);
                  if (_id) {
                    _el.id = _id[1].trim();
                  }
                  while ((_class = reClass.exec(original)) !== null) {
                    _el.classList.add(_class[1]);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return new Microbe('', '', _el);
};
Microbe.prototype.first = function() {
  if (this.length === 1) {
    return this;
  }
  return new Microbe('', '', [this[0]]);
};
Microbe.prototype.getParentIndex = function(_el) {
  var _getParentIndex = function(_elm) {
    return Array.prototype.indexOf.call(_elm.parentNode.children, _elm);
  };
  var indexes = [];
  if (_el) {
    indexes = _getParentIndex(_el);
    return indexes;
  }
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    indexes.push(_getParentIndex(this[$traceurRuntime.toProperty(i)]));
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return indexes;
};
Microbe.prototype.html = function(_value, _el) {
  var _setHtml = function(_elm) {
    _elm.innerHTML = _value;
  };
  var _getHtml = function(_elm) {
    return _elm.innerHTML;
  };
  if (_value || _value === '') {
    if (_el) {
      _setHtml(_el);
      return this;
    }
    {
      try {
        throw undefined;
      } catch ($len) {
        try {
          throw undefined;
        } catch ($i) {
          {
            {
              $i = 0;
              $len = this.length;
            }
            for (; $i < $len; $i++) {
              try {
                throw undefined;
              } catch (len) {
                try {
                  throw undefined;
                } catch (i) {
                  {
                    {
                      i = $i;
                      len = $len;
                    }
                    try {
                      _setHtml(this[$traceurRuntime.toProperty(i)]);
                    } finally {
                      $i = i;
                      $len = len;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return this;
  }
  var markup = [];
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    markup.push(_getHtml(this[$traceurRuntime.toProperty(i)]));
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (markup.length === 1) {
    return markup[0];
  }
  return markup;
};
Microbe.prototype.insertAfter = function(_elAfter, _el) {
  var _insertAfter = function(_elm) {
    _elAfter = this.micro.apply(this, [_elAfter]);
    _elm = this.micro.apply(this, [_elm]);
    var nextIndex;
    {
      try {
        throw undefined;
      } catch ($len) {
        try {
          throw undefined;
        } catch ($i) {
          {
            {
              $i = 0;
              $len = _elm.length;
            }
            for (; $i < $len; $i++) {
              try {
                throw undefined;
              } catch (len) {
                try {
                  throw undefined;
                } catch (i) {
                  {
                    {
                      i = $i;
                      len = $len;
                    }
                    try {
                      try {
                        throw undefined;
                      } catch (nextEle) {
                        {
                          nextIndex = this.getParentIndex(_elm[$traceurRuntime.toProperty(i)]);
                          nextEle = _elm[$traceurRuntime.toProperty(i)].parentNode.children[$traceurRuntime.toProperty(nextIndex + 1)];
                          if (nextEle) {
                            nextEle.parentNode.insertBefore(_elAfter[0].cloneNode(true), nextEle);
                          } else {
                            _elm[$traceurRuntime.toProperty(i)].parentNode.appendChild(_elAfter[0].cloneNode(true));
                          }
                        }
                      }
                    } finally {
                      $i = i;
                      $len = len;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  if (_el) {
    _insertAfter.apply(this, [_el]);
    return this;
  }
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    _insertAfter.apply(this, [this[$traceurRuntime.toProperty(i)]]);
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return this;
};
Microbe.prototype.last = function() {
  if (this.length === 1) {
    return this;
  }
  return new Microbe('', '', [this[$traceurRuntime.toProperty(this.length - 1)]]);
};
Microbe.prototype.parent = function(_el) {
  var _parent = function(_elm) {
    return _elm.parentNode;
  };
  var parentArray = [];
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    parentArray.push(_parent(this[$traceurRuntime.toProperty(i)]));
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return new Microbe('', '', parentArray);
};
Microbe.prototype.remove = function(_el) {
  var _remove = function(_elm) {
    return _elm.parentNode.removeChild(_elm);
  };
  if (_el) {
    _remove(_el);
  }
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    _remove(this[$traceurRuntime.toProperty(i)]);
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return this;
};
Microbe.prototype.text = function(_value, _el) {
  var _setText = function(_elm) {
    if (document.all) {
      _elm.innerText = _value;
    } else {
      _elm.textContent = _value;
    }
  };
  var _getText = function(_elm) {
    if (document.all) {
      return _elm.innerText;
    } else {
      return _elm.textContent;
    }
  };
  if (_value) {
    if (_el) {
      _setText(_el);
      return this;
    }
    {
      try {
        throw undefined;
      } catch ($len) {
        try {
          throw undefined;
        } catch ($i) {
          {
            {
              $i = 0;
              $len = this.length;
            }
            for (; $i < $len; $i++) {
              try {
                throw undefined;
              } catch (len) {
                try {
                  throw undefined;
                } catch (i) {
                  {
                    {
                      i = $i;
                      len = $len;
                    }
                    try {
                      _setText(this[$traceurRuntime.toProperty(i)]);
                    } finally {
                      $i = i;
                      $len = len;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return this;
  }
  var arrayText = [];
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    arrayText.push(_getText(this[$traceurRuntime.toProperty(i)]));
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (arrayText.length === 1) {
    return arrayText[0];
  }
  return arrayText;
};
Microbe.prototype.addClass = function(_class, _el) {
  var _addClass = function(_elm) {
    _elm.classList.add(_class);
  };
  if (_el) {
    _addClass(_el);
    return this;
  }
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    _addClass(this[$traceurRuntime.toProperty(i)]);
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return this;
};
Microbe.prototype.css = function(_property, _value, _el) {
  var _setCss = function(_elm) {
    if (_value === null) {
      _elm.style.removeProperty(_property);
    } else {
      $traceurRuntime.setProperty(_elm.style, _property, _value);
    }
  };
  var _getCss = function(_elm) {
    return window.getComputedStyle(_elm).getPropertyValue(_property);
  };
  if (_value !== undefined) {
    if (_el) {
      _setCss(_el);
      return this;
    }
    {
      try {
        throw undefined;
      } catch ($len) {
        try {
          throw undefined;
        } catch ($i) {
          {
            {
              $i = 0;
              $len = this.length;
            }
            for (; $i < $len; $i++) {
              try {
                throw undefined;
              } catch (len) {
                try {
                  throw undefined;
                } catch (i) {
                  {
                    {
                      i = $i;
                      len = $len;
                    }
                    try {
                      _setCss(this[$traceurRuntime.toProperty(i)]);
                    } finally {
                      $i = i;
                      $len = len;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return this;
  }
  var styles = [];
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    styles.push(_getCss(this[$traceurRuntime.toProperty(i)]));
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (styles.length === 1) {
    return styles[0];
  }
  return styles;
};
Microbe.prototype.hasClass = function(_class, _el) {
  var _hasClass = function(_elm) {
    _elm.classList.contains(_class);
  };
  if (_el) {
    return _hasClass(_el);
  }
  var i,
      len,
      results = [];
  for (i = 0, len = this.length; i < len; i++) {
    results.push(_hasClass(this[$traceurRuntime.toProperty(i)]));
  }
  return results;
};
Microbe.prototype.removeClass = function(_class, _el) {
  var _removeClass = function(_elm) {
    _elm.classList.remove(_class);
    if (_elm.classList.length === 0) {
      _elm.removeAttribute('class');
    }
  };
  if (_el) {
    _removeClass(_el);
    return this;
  }
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    _removeClass(this[$traceurRuntime.toProperty(i)]);
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return this;
};
Microbe.prototype.toggleClass = function(_class, _el) {
  var _toggleClass = function(_elm) {
    if (_elm.classList.contains(_class)) {
      _elm.classList.add(_class);
    } else {
      _elm.classList.remove(_class);
    }
  };
  if (_el) {
    _toggleClass(_el);
    return this;
  }
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    _toggleClass(this[$traceurRuntime.toProperty(i)]);
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return this;
};
Microbe.prototype.bind = function(_event, _callback, _el) {
  var _bind = function(_elm) {
    if (!_elm.addEventListener) {
      _elm.attachEvent(_event, _callback);
    } else {
      _elm.addEventListener(_event, _callback);
    }
  };
  if (_el) {
    _bind(_el);
    return this;
  }
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    _bind(this[$traceurRuntime.toProperty(i)]);
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return this;
};
Microbe.prototype.unbind = function(_event, _callback, _el) {
  var _unbind = function(_elm) {
    _elm.removeEventListener(_event, _callback);
  };
  if (_el) {
    _unbind(_el);
    return this;
  }
  {
    try {
      throw undefined;
    } catch ($len) {
      try {
        throw undefined;
      } catch ($i) {
        {
          {
            $i = 0;
            $len = this.length;
          }
          for (; $i < $len; $i++) {
            try {
              throw undefined;
            } catch (len) {
              try {
                throw undefined;
              } catch (i) {
                {
                  {
                    i = $i;
                    len = $len;
                  }
                  try {
                    _unbind(this[$traceurRuntime.toProperty(i)]);
                  } finally {
                    $i = i;
                    $len = len;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return this;
};
Microbe.prototype.ready = function(_callback) {
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', _callback, false);
  }
  if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
    try {
      throw undefined;
    } catch (DOMLoadTimer) {
      {
        DOMLoadTimer = setInterval(function() {
          if (/loaded|complete/i.test(document.readyState)) {
            _callback();
            clearInterval(DOMLoadTimer);
          }
        }, 10);
      }
    }
  }
  window.onload = _callback;
};
Microbe.prototype.http = function(_parameters) {
  return new Promise(function(resolve, reject) {
    if (!_parameters) {
      reject(new Error('No parameters given'));
    }
    if (typeof _parameters === 'string') {
      _parameters = {url: _parameters};
    }
    var req = new XMLHttpRequest();
    var method = _parameters.method || 'GET';
    var url = _parameters.url;
    var data = JSON.stringify(_parameters.data) || null;
    var user = _parameters.user || '';
    var password = _parameters.password || '';
    var headers = _parameters.headers || null;
    req.onreadystatechange = function() {
      if (req.readyState === 4) {
        return req;
      }
    };
    req.onerror = function() {
      reject(new Error('Network error!'));
    };
    req.open(method, url, true, user, password);
    if (headers) {
      if (Array.isArray(headers)) {
        {
          try {
            throw undefined;
          } catch ($len) {
            try {
              throw undefined;
            } catch ($i) {
              {
                {
                  $i = 0;
                  $len = headers.length;
                }
                for (; $i < $len; $i++) {
                  try {
                    throw undefined;
                  } catch (len) {
                    try {
                      throw undefined;
                    } catch (i) {
                      {
                        {
                          i = $i;
                          len = $len;
                        }
                        try {
                          req.setRequestHeader(headers[$traceurRuntime.toProperty(i)].header, headers[$traceurRuntime.toProperty(i)].value);
                        } finally {
                          $i = i;
                          $len = len;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        req.setRequestHeader(headers.header, headers.value);
      }
    }
    req.send(data);
    req.onload = function() {
      if (req.status === 200) {
        resolve(req.response);
      } else {
        reject(new Error(req.status));
      }
    };
  });
};
Microbe.prototype.http.get = function(_url) {
  return this({
    url: _url,
    method: 'GET'
  });
};
Microbe.prototype.http.post = function(_url, _data) {
  return this({
    url: _url,
    data: _data,
    method: 'POST'
  });
};
var µ = (function() {
  var inner = function(selector, scope) {
    var microbeInner = new Microbe(selector, scope);
    return microbeInner;
  };
  for (var $prop in Microbe.prototype) {
    try {
      throw undefined;
    } catch (prop) {
      {
        prop = $prop;
        if (Microbe.prototype.hasOwnProperty(prop)) {
          $traceurRuntime.setProperty(inner, prop, Microbe.prototype[$traceurRuntime.toProperty(prop)]);
        }
      }
    }
  }
  return inner;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1pY3JvYmUudHJhY2V1ci5qcyIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8xNSIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8xNCIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8zIiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzIiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvNCIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8xMyIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci83IiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzEyIiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzUiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvMTEiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvOCIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci85IiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzYiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvMTAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBY0E7WUFBQSxTQUFNLFFBQU0sQ0FnQkssU0FBUSxBQUFpQztJQUE5QixPQUFLLDZDQUFFLFNBQU87SUFBRyxVQUFRLDZDQUFFLEtBQUc7SUFFOUMsQ0FBQSxRQUFPO0FBRVgsS0FBSyxTQUFRLFNBQVMsSUFBTSxFQUFBLENBQzVCO0FBQ0ksU0FBTyxDQUFBLElBQUcsT0FBTyxBQUFDLENBQUUsU0FBUSxDQUFFLENBQUM7RUFDbkMsS0FDSyxLQUFLLFFBQU8sS0FBSyxBQUFDLENBQUUsU0FBUSxDQUFFLENBQ25DO0FBQ0ksU0FBTyxDQUFBLElBQUcsT0FBTyxBQUFDLENBQUUsU0FBUSxVQUFVLEFBQUMsQ0FBRSxDQUFB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ZUFBZSxBQUFDLENBQUUsSUFBRyxDQUFFLENBQzVDO0FDeG9DUixBRHlvQ1ksd0JDem9DRSxZQUFZLEFBQUMsQ0R5b0NmLEtBQUksQ0FBRyxLQUFHLENFem9DdEIsQ0Z5b0M0QixPQUFNLFVBQVUsQ0V6b0MxQixlQUFjLFdBQVcsQUFBQyxDRnlvQ0csSUFBRyxDRXpvQ1ksQ0FBQyxDRENqQixDRHdvQ087UUFDN0M7QUFBQTs7O0FBR0osT0FBTyxNQUFJLENBQUM7QUFDaEIsQUFBQyxFQUFDLENBQUM7QUFJSCIsImZpbGUiOiJtaWNyb2JlLnRyYWNldXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbi8qKlxuICogbWljcm9iZS5qc1xuICpcbiAqIEBhdXRob3IgIE1vdXNlIEJyYXVuICAgICAgICAgPG1vdXNlQHNvY2lvbWFudGljLmNvbT5cbiAqIEBhdXRob3IgIE5pY29sYXMgQnJ1Z25lYXV4ICAgPG5pY29sYXMuYnJ1Z25lYXV4QHNvY2lvbWFudGljLmNvbT5cbiAqXG4gKiBAcGFja2FnZSBNaWNyb2JlXG4gKi9cblxuLyoqXG4gKiBDbGFzcyBNaWNyb2JlXG4gKi9cbmNsYXNzIE1pY3JvYmVcbntcbiAgICAvKlxuICAgICogQ29uc3RydWN0b3IuXG4gICAgKiBFaXRoZXIgc2VsZWN0cyBvciBjcmVhdGVzIGFuIEhUTUwgZWxlbWVudCBhbmQgd3JhcHMgaW4gaW50byBhbiBNaWNyb2JlXG4gICAgKiBpbnN0YW5jZS5cbiAgICAqIFVzYWdlOiAgIMK1KCdkaXYjdGVzdCcpICAgLS0tPiBzZWxlY3Rpb25cbiAgICAqICAgICAgICAgIMK1KCc8ZGl2I3Rlc3Q+JykgLS0tPiBjcmVhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSAgIF9zZWxlY3RvciAgIHN0cmluZyBvciBIVE1MRWxlbWVudCAgIEhUTUwgc2VsZWN0b3JcbiAgICAqIEBwYXJhbSAgIF9zY29wZSAgICAgIEhUTUxFbGVtZW50ICAgICAgICAgICAgIHNjb3BlIHRvIGxvb2sgaW5zaWRlXG4gICAgKiBAcGFyYW0gICBfZWxlbWVudHMgICBIVE1MRWxlbWVudChzKSAgICAgICAgICBlbGVtZW50cyB0byBmaWxsIE1pY3JvYmUgd2l0aFxuICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9wdGlvbmFsKVxuICAgICpcbiAgICAqIEByZXR1cm4gIE1pY3JvYmVcbiAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCBfc2VsZWN0b3IsIF9zY29wZT1kb2N1bWVudCwgX2VsZW1lbnRzPW51bGwgKVxuICAgIHtcbiAgICAgICAgbGV0IGVsZW1lbnRzO1xuXG4gICAgICAgIGlmICggX3NlbGVjdG9yLm5vZGVUeXBlID09PSAxIClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKCBfc2VsZWN0b3IgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICggL148Lis+JC8udGVzdCggX3NlbGVjdG9yICkgKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUoIF9zZWxlY3Rvci5zdWJzdHJpbmcoIDEsIF9zZWxlY3Rvci5sZW5ndGggLSAxICkgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCBfc2VsZWN0b3IgKSA9PT0gJ1tvYmplY3QgTm9kZUxpc3RdJyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGVsZW1lbnRzID0gX3NlbGVjdG9yO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCBfZWxlbWVudHMgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIEFycmF5LmlzQXJyYXkoIF9lbGVtZW50cyApIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IF9lbGVtZW50cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IFsgX2VsZW1lbnRzIF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBlbGVtZW50cyA9IF9zY29wZS5xdWVyeVNlbGVjdG9yQWxsKCBfc2VsZWN0b3IgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGVuZ3RoID0gZWxlbWVudHMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzWyBpIF0gPSBlbGVtZW50c1sgaSBdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKCBsZXQgcHJvcCBpbiBNaWNyb2JlLnByb3RvdHlwZSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggTWljcm9iZS5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoIHByb3AgKSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHNbIHByb3AgXSA9IE1pY3JvYmUucHJvdG90eXBlWyBwcm9wIF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAqIEZvciBlYWNoXG4gICAgKlxuICAgICogTWV0aG9kcyBpdGVyYXRlcyB0aHJvdWdoIGFsbCB0aGUgZWxlbWVudHMgYW4gZXhlY3V0ZSB0aGUgZnVuY3Rpb24gb24gZWFjaCBvZlxuICAgICogdGhlbVxuICAgICpcbiAgICAqIEByZXR1cm4gIEFycmF5XG4gICAgKi9cbiAgICBlYWNoKCBfdGFyZ2V0LCBfY2FsbGJhY2sgKVxuICAgIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgX3RhcmdldCA9PT0gJ2Z1bmN0aW9uJyAmJiAhX2NhbGxiYWNrIClcbiAgICAgICAge1xuICAgICAgICAgICAgX2NhbGxiYWNrID0gX3RhcmdldDtcbiAgICAgICAgICAgIF90YXJnZXQgICA9IHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAoIGxldCBpdGVtIG9mIHRoaXMuaXRlcmF0b3IoIF90YXJnZXQgKSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9jYWxsYmFjayggaXRlbSwgaSsrICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RhcmdldDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICogSXRlcmF0b3JcbiAgICAqXG4gICAgKiBHZW5lcmF0b3IgeWllbGRzIG5leHQgZWxlbWVudCBvZiB0aGUgaXRlcmFibGUgb2JqZWN0IGdpdmVuIGluIHBhcmFtZXRlci5cbiAgICAqXG4gICAgKiBAcGFyYW0gIHtpdGVyYWJsZX0gICAgICBfaXRlcmFibGUgb2JqZWN0IHRvIGl0ZXJhdGUgdGhyb3VnaFxuICAgICogQHlpZWxkICB7bWl4ZWR9ICAgICAgICAgd2hhdCdzIGluc2lkZSB0aGUgbmV4dCBpbmRleFxuICAgICovXG4gICAgKiBpdGVyYXRvciggX2l0ZXJhYmxlPXRoaXMgKVxuICAgIHtcbiAgICAgICAgbGV0IG5leHRJbmRleCA9IDA7XG5cbiAgICAgICAgd2hpbGUoIG5leHRJbmRleCA8IF9pdGVyYWJsZS5sZW5ndGggKVxuICAgICAgICB7XG4gICAgICAgICAgICB5aWVsZCBfaXRlcmFibGVbbmV4dEluZGV4KytdO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAqIGNoZWNrIG1pY3JvXG4gICAgKlxuICAgICogdGhpcyBjaGVjayBpZiBzb21ldGhpbmcgaXMgYSBNaWNyb2JlIG9iamVjdC4gIG1pY3JvYmVzIGFyZSByZXR1cm5lZC4gZWxlbWVudHMgYXJlXG4gICAgKiB3cmFwcGVkIGludG8gbWljcm9iZSBvYmplY3RzLiBTdHJpbmdzIGFyZSBidWlsdCB1c2luZyB0aGUgY3JlYXRlIG1ldGhvZCwgdGhlbiB3cmFwcGVkXG4gICAgKiBpbnRvIG1pY3JvYmVzIGFuZCByZXR1cm5lZC5cbiAgICAqXG4gICAgKiBAcGFyYW0gIHthbnl0aGluZ30gX29iaiBvYmplY3QgdG8gY2hlY2sgdHlwZVxuICAgICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgbWljcm9iZSBvYmplY3RcbiAgICAqL1xuICAgIG1pY3JvKCBfb2JqIClcbiAgICB7XG4gICAgICAgIGlmICggX29iai50eXBlID09PSAnW29iamVjdCBNaWNyb2JlXScgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIC9ePC4rPiQvLnRlc3QoIF9vYmogKSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKCBfb2JqLnN1YnN0cmluZyggMSwgX29iai5sZW5ndGggLSAxICkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE1pY3JvYmUoIF9vYmogKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfb2JqO1xuICAgIH1cblxuXG4gICAvKipcbiAgICAqIFRvIGFycmF5XG4gICAgKlxuICAgICogTWV0aG9kcyByZXR1cm5zIGFsbCB0aGUgZWxlbWVudHMgaW4gYW4gYXJyYXkuXG4gICAgKlxuICAgICogQHJldHVybiAgQXJyYXlcbiAgICAqL1xuICAgIHRvQXJyYXkoKVxuICAgIHtcbiAgICAgICAgbGV0IGFyciA9IFtdO1xuICAgICAgICBmb3IgKCBsZXQgaXRlbSBvZiB0aGlzLml0ZXJhdG9yKCkgKVxuICAgICAgICB7XG4gICAgICAgICAgICBhcnIucHVzaCggaXRlbSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfVxufVxuXG5NaWNyb2JlLnByb3RvdHlwZS50eXBlID0gJ1tvYmplY3QgTWljcm9iZV0nO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoganNoaW50IGVzbmV4dDogdHJ1ZSovXG4vKipcbiAqIG1pY3JvYmUuaHRtbC5qc1xuICpcbiAqIEBhdXRob3IgIE1vdXNlIEJyYXVuICAgICAgICAgPG1vdXNlQHNvY2lvbWFudGljLmNvbT5cbiAqIEBhdXRob3IgIE5pY29sYXMgQnJ1Z25lYXV4ICAgPG5pY29sYXMuYnJ1Z25lYXV4QHNvY2lvbWFudGljLmNvbT5cbiAqXG4gKiBAcGFja2FnZSBNaWNyb2JlXG4gKi9cblxuXG4vKipcbiAqIEFwcGVuZCBFbGVtZW50XG4gKlxuICogQHBhcmFtICB7W3R5cGVdfSBfZWxlICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gX3BhcmVudCBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5NaWNyb2JlLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiggX2VsLCBfcGFyZW50IClcbntcbiAgICBsZXQgX2FwcGVuZCA9IGZ1bmN0aW9uKCBfcGFyZW50RWwsIF9lbG0gKVxuICAgIHtcbiAgICAgICAgaWYgKCBfZWxtIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3BhcmVudEVsLmFwcGVuZENoaWxkKCBfZWxtICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBfcGFyZW50RWwuYXBwZW5kQ2hpbGQoIF9lbCApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGlmICggX3BhcmVudCApXG4gICAge1xuICAgICAgICBfYXBwZW5kKCBfcGFyZW50ICk7XG4gICAgfVxuICAgIGlmICghX2VsLmxlbmd0aCApXG4gICAge1xuICAgICAgICBfZWwgPSBbIF9lbCBdO1xuICAgIH1cblxuICAgIGZvciAoIGxldCBpID0gMCwgbGVuaSA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuaTsgaSsrIClcbiAgICB7XG4gICAgICAgIGZvciAoIGxldCBqID0gMCwgbGVuaiA9IF9lbC5sZW5ndGg7IGogPCBsZW5qOyBqKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIGkgIT09IDAgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9hcHBlbmQoIHRoaXNbIGkgXSwgX2VsWyBqIF0uY2xvbmVOb2RlKHRydWUpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2FwcGVuZCggdGhpc1sgaSBdLCBfZWxbIGogXSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG5cbn07XG5cblxuIC8qKlxuICogQWx0ZXIvR2V0IEF0dHJpYnV0ZVxuICpcbiAqIENoYW5nZXMgdGhlIGF0dHJpYnV0ZSBieSB3cml0aW5nIHRoZSBnaXZlbiBwcm9wZXJ0eSBhbmQgdmFsdWUgdG8gdGhlXG4gKiBzdXBwbGllZCBlbGVtZW50cy4gKHByb3BlcnRpZXMgc2hvdWxkIGJlIHN1cHBsaWVkIGluIGphdmFzY3JpcHQgZm9ybWF0KS5cbiAqIElmIHRoZSB2YWx1ZSBpcyBvbWl0dGVkLCBzaW1wbHkgcmV0dXJucyB0aGUgY3VycmVudCBhdHRyaWJ1dGUgdmFsdWUgIG9mIHRoZVxuICogZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gICBfYXR0cmlidXRlICBzdHJpbmcgICAgICAgICAgIEpTIGZvcm1hdHRlZCBDU1MgcHJvcGVydHlcbiAqIEBwYXJhbSAgIF9lbCAgICAgICAgIEhUTUxFTGVtZW50ICAgICAgZWxlbWVudCB0byBtb2RpZnkgKG9wdGlvbmFsKVxuICogQHBhcmFtICAgX3ZhbHVlICAgICAgc3RyaW5nICAgICAgICAgICBDU1MgdmFsdWUgKG9wdGlvbmFsKVxuICpcbiAqIEByZXR1cm4gIG1peGVkICggTWljcm9iZSBvciBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncylcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24gKCBfYXR0cmlidXRlLCBfdmFsdWUsIF9lbClcbntcbiAgICBsZXQgX3NldEF0dHI7XG4gICAgbGV0IF9nZXRBdHRyO1xuICAgIGxldCBfcmVtb3ZlQXR0cjtcblxuICAgIF9zZXRBdHRyID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgaWYgKCBfdmFsdWUgPT09IG51bGwgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfcmVtb3ZlQXR0ciggX2VsbSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCAhX2VsbS5nZXRBdHRyaWJ1dGUgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9lbG1bIF9hdHRyaWJ1dGUgXSA9IF92YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfZWxtLnNldEF0dHJpYnV0ZSggX2F0dHJpYnV0ZSwgX3ZhbHVlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgX2dldEF0dHIgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICBpZiAoIF9lbG0uZ2V0QXR0cmlidXRlKCBfYXR0cmlidXRlICkgPT09IG51bGwgKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gX2VsbVsgX2F0dHJpYnV0ZSBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZWxtLmdldEF0dHJpYnV0ZSggX2F0dHJpYnV0ZSApO1xuICAgIH07XG5cbiAgICBfcmVtb3ZlQXR0ciA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIGlmICggX2VsbS5nZXRBdHRyaWJ1dGUoIF9hdHRyaWJ1dGUgKSA9PT0gbnVsbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRlbGV0ZSBfZWxtWyBfYXR0cmlidXRlIF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBfZWxtLnJlbW92ZUF0dHJpYnV0ZSggX2F0dHJpYnV0ZSApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGlmICggX3ZhbHVlICE9PSB1bmRlZmluZWQgKVxuICAgIHtcbiAgICAgICAgaWYgKCBfZWwgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfc2V0QXR0ciggX2VsICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9zZXRBdHRyKCB0aGlzWyBpIF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxldCBhdHRyaWJ1dGVzID0gW107XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKCBfZ2V0QXR0ciggdGhpc1sgaSBdICkgKTtcbiAgICB9XG5cbiAgICBpZiAoIGF0dHJpYnV0ZXMubGVuZ3RoID09PSAxIClcbiAgICB7XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzWzBdO1xuICAgIH1cblxuICAgIHJldHVybiBhdHRyaWJ1dGVzO1xufTtcblxuXG4vKipcbiAqIEdldCBDaGlsZHJlblxuICpcbiAqIGdldHMgYW4gYXJyYXkgb3IgYWxsIHRoZSBnaXZlbiBlbGVtZW50J3MgY2hpbGRyZW5cbiAqXG4gKiBAcGFyYW0gIHtbdHlwZV19IF9lbCBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbk1pY3JvYmUucHJvdG90eXBlLmNoaWxkcmVuID0gZnVuY3Rpb24oIF9lbCApXG57XG4gICAgbGV0IF9jaGlsZHJlbiA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIHJldHVybiBfZWxtLmNoaWxkcmVuO1xuICAgIH07XG5cbiAgICBsZXQgY2hpbGRyZW5BcnJheSA9IFtdO1xuXG4gICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICB7XG4gICAgICAgIGNoaWxkcmVuQXJyYXkucHVzaCggX2NoaWxkcmVuKCB0aGlzWyBpIF0gKSApO1xuICAgIH1cblxuICAgIGlmICggY2hpbGRyZW5BcnJheS5sZW5ndGggPT09IDEgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuQXJyYXlbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkcmVuQXJyYXk7XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlIEVsZW1lbnRcbiAqXG4gKiBNZXRob2QgY3JlYXRlcyBhIE1pY3JvYmUgZnJvbSBhbiBlbGVtZW50IG9yIGEgbmV3IGVsZW1lbnQgb2YgdGhlIHBhc3NlZCBzdHJpbmcsIGFuZFxuICogcmV0dXJucyB0aGUgTWljcm9iZVxuICpcbiAqIEBwYXJhbSAgIF9lbCAgICAgICAgIEhUTUxFTGVtZW50ICAgICBlbGVtZW50IHRvIGNyZWF0ZVxuICpcbiAqIEByZXR1cm4gIE1pY3JvYmVcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoIF9lbCApXG57XG4gICAgaWYgKCB0eXBlb2YgX2VsID09PSAnc3RyaW5nJyApXG4gICAge1xuICAgICAgICBsZXQgcmVDbGFzcyAgICAgPSAvXFwuKFteLiQjXSspL2c7XG4gICAgICAgIGxldCByZUlkICAgICAgICA9IC8jKFteLiRdKykvO1xuICAgICAgICBsZXQgcmVFbGVtZW50ICAgPSAvWyMuXS87XG4gICAgICAgIGxldCBfY2xhc3M7XG5cbiAgICAgICAgbGV0IG9yaWdpbmFsID0gX2VsO1xuICAgICAgICBfZWwgPSBfZWwuc3BsaXQoIHJlRWxlbWVudCApWyAwIF07XG4gICAgICAgIF9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIF9lbCApO1xuXG4gICAgICAgIGxldCBfaWQgPSBvcmlnaW5hbC5tYXRjaCggcmVJZCApO1xuICAgICAgICBpZiAoIF9pZCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9lbC5pZCA9IF9pZFsxXS50cmltKCk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoICggX2NsYXNzID0gcmVDbGFzcy5leGVjKCBvcmlnaW5hbCApICkgIT09IG51bGwgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfZWwuY2xhc3NMaXN0LmFkZCggX2NsYXNzWzFdICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE1pY3JvYmUoJycsICcnLCBfZWwgKTtcbn07XG5cblxuLyoqXG4gKiBHZXQgRmlyc3QgRWxlbWVudFxuICpcbiAqIE1ldGhvZHMgZ2V0cyB0aGUgZmlyc3QgSFRNTCBFbGVtZW50cyBvZiB0aGUgY3VycmVudCBvYmplY3QsIGFuZCB3cmFwIGl0IGluXG4gKiBNaWNyb2JlIGZvciBjaGFpbmluZyBwdXJwb3NlLlxuICpcbiAqIEByZXR1cm4gIE1pY3JvYmVcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5maXJzdCA9IGZ1bmN0aW9uICgpXG57XG4gICAgaWYgKCB0aGlzLmxlbmd0aCA9PT0gMSApXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE1pY3JvYmUoICcnLCAnJywgWyB0aGlzWyAwIF0gXSApO1xufTtcblxuXG4vKipcbiAqIEdldCBQYXJlbnQgSW5kZXhcbiAqXG4gKiBnZXRzIHRoZSBpbmRleCBvZiB0aGUgaXRlbSBpbiBpdCdzIHBhcmVudE5vZGUncyBjaGlsZHJlbiBhcnJheVxuICpcbiAqIEBwYXJhbSAge2VsZW1lbnQgb2JqZWN0IG9yIGFycmF5fSBfZWwgb2JqZWN0IHRvIGZpbmQgdGhlIGluZGV4IG9mIChvcHRpb25hbClcbiAqIEByZXR1cm4ge2FycmF5fSAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkgb2YgaW5kZXhlc1xuICovXG5NaWNyb2JlLnByb3RvdHlwZS5nZXRQYXJlbnRJbmRleCA9IGZ1bmN0aW9uKCBfZWwgKVxue1xuICAgIGxldCBfZ2V0UGFyZW50SW5kZXggPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbCggX2VsbS5wYXJlbnROb2RlLmNoaWxkcmVuLCBfZWxtICk7XG4gICAgfTtcblxuICAgIGxldCBpbmRleGVzID0gW107XG5cbiAgICBpZiAoIF9lbCApXG4gICAge1xuICAgICAgICBpbmRleGVzID0gX2dldFBhcmVudEluZGV4KCBfZWwgKTtcbiAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgfVxuXG4gICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICB7XG4gICAgICAgIGluZGV4ZXMucHVzaCggX2dldFBhcmVudEluZGV4KCB0aGlzWyBpIF0gKSApO1xuICAgIH1cblxuICAgIHJldHVybiBpbmRleGVzO1xufTtcblxuXG4vKipcbiAqIEFsdGVyL0dldCBpbm5lciBIVE1MXG4gKlxuICogQ2hhbmdlcyB0aGUgaW5uZXJIdG1sIHRvIHRoZSBzdXBwbGllZCBzdHJpbmcuXG4gKiBJZiB0aGUgdmFsdWUgaXMgb21pdHRlZCwgc2ltcGx5IHJldHVybnMgdGhlIGN1cnJlbnQgaW5uZXIgaHRtbCB2YWx1ZSBvZiB0aGUgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gICBfdmFsdWUgICAgICBzdHJpbmcgICAgICAgICAgaHRtbCB2YWx1ZSAob3B0aW9uYWwpXG4gKiBAcGFyYW0gICBfZWwgICAgICAgICBIVE1MRUxlbWVudCAgICAgZWxlbWVudCB0byBtb2RpZnkgKG9wdGlvbmFsKVxuICpcbiAqIEByZXR1cm4gIG1peGVkICggTWljcm9iZSBvciBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncylcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5odG1sID0gZnVuY3Rpb24gKCBfdmFsdWUsIF9lbClcbntcbiAgICBsZXQgX3NldEh0bWwgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICBfZWxtLmlubmVySFRNTCA9IF92YWx1ZTtcbiAgICB9O1xuXG4gICAgbGV0IF9nZXRIdG1sID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIF9lbG0uaW5uZXJIVE1MO1xuICAgIH07XG5cbiAgICBpZiAoIF92YWx1ZSB8fCBfdmFsdWUgPT09ICcnIClcbiAgICB7XG4gICAgICAgIGlmICggX2VsIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3NldEh0bWwoIF9lbCApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfc2V0SHRtbCggdGhpc1sgaSBdICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBsZXQgbWFya3VwID0gW107XG4gICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICB7XG4gICAgICAgIG1hcmt1cC5wdXNoKCBfZ2V0SHRtbCggdGhpc1sgaSBdICkgKTtcbiAgICB9XG5cbiAgICBpZiAoIG1hcmt1cC5sZW5ndGggPT09IDEgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG1hcmt1cFswXTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcmt1cDtcbn07XG5cblxuLyoqXG4gKiBJbnNlcnQgQWZ0ZXJcbiAqXG4gKiBJbnNlcnRzIHRoZSBnaXZlbiBlbGVtZW50IGFmdGVyIGVhY2ggb2YgdGhlIGVsZW1lbnRzIGdpdmVuIChvciBwYXNzZWQgdGhyb3VnaCB0aGlzKS5cbiAqIGlmIGl0IGlzIGFuIGVsZW1uZXQgaXQgaXMgd3JhcHBlZCBpbiBhIG1pY3JvYmUgb2JqZWN0LiAgaWYgaXQgaXMgYSBzdHJpbmcgaXQgaXMgY3JlYXRlZFxuICpcbiAqIEBleGFtcGxlIMK1KCAnLmVsZW1lbnRzSW5Eb20nICkuaW5zZXJ0QWZ0ZXIoIMK1RWxlbWVudFRvSW5zZXJ0IClcbiAqXG4gKiBAcGFyYW0gIHtvYmplY3Qgb3Igc3RyaW5nfSBfZWxBZnRlciBlbGVtZW50IHRvIGluc2VydFxuICogQHBhcmFtICB7b2JqZWN0fSBfZWwgICAgICBlbGVtZW50IHRvIGluc2VydCBhZnRlciAob3B0aW9uYWwpXG4gKlxuICogQHJldHVybiBNaWNyb2JlXG4gKi9cbk1pY3JvYmUucHJvdG90eXBlLmluc2VydEFmdGVyID0gZnVuY3Rpb24oIF9lbEFmdGVyLCBfZWwgKVxue1xuICAgIGxldCBfaW5zZXJ0QWZ0ZXIgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICBfZWxBZnRlciA9IHRoaXMubWljcm8uYXBwbHkoIHRoaXMsIFsgX2VsQWZ0ZXIgXSApO1xuICAgICAgICBfZWxtICAgICA9IHRoaXMubWljcm8uYXBwbHkoIHRoaXMsIFsgX2VsbSBdICk7XG5cbiAgICAgICAgbGV0IG5leHRJbmRleDtcblxuICAgICAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IF9lbG0ubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICBuZXh0SW5kZXggPSB0aGlzLmdldFBhcmVudEluZGV4KCBfZWxtWyBpIF0gKTtcblxuICAgICAgICAgICAgbGV0IG5leHRFbGUgICA9IF9lbG1bIGkgXS5wYXJlbnROb2RlLmNoaWxkcmVuWyBuZXh0SW5kZXggKyAxIF07XG5cbiAgICAgICAgICAgIGlmICggbmV4dEVsZSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmV4dEVsZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggX2VsQWZ0ZXJbMF0uY2xvbmVOb2RlKCB0cnVlICksIG5leHRFbGUgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfZWxtWyBpIF0ucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCggX2VsQWZ0ZXJbMF0uY2xvbmVOb2RlKCB0cnVlICkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIF9lbCApXG4gICAge1xuICAgICAgICBfaW5zZXJ0QWZ0ZXIuYXBwbHkoIHRoaXMsIFsgX2VsIF0gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICB7XG4gICAgICAgIF9pbnNlcnRBZnRlci5hcHBseSggdGhpcywgWyB0aGlzWyBpIF0gXSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEdldCBMYXN0IEVsZW1lbnRcbiAqXG4gKiBNZXRob2RzIGdldHMgdGhlIGxhc3QgSFRNTCBFbGVtZW50cyBvZiB0aGUgY3VycmVudCBvYmplY3QsIGFuZCB3cmFwIGl0IGluXG4gKiBNaWNyb2JlIGZvciBjaGFpbmluZyBwdXJwb3NlLlxuICpcbiAqIEByZXR1cm4gIE1pY3JvYmVcbiAqL1xuTWljcm9iZS5wcm90b3R5cGUubGFzdCA9IGZ1bmN0aW9uICgpXG57XG4gICAgaWYgKCB0aGlzLmxlbmd0aCA9PT0gMSApXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE1pY3JvYmUoICcnLCAnJywgWyB0aGlzWyB0aGlzLmxlbmd0aCAtIDEgXSBdICk7XG59O1xuXG5cbi8qKlxuICogR2V0IFBhcmVudFxuICpcbiAqIHNldHMgYWxsIGVsZW1lbnRzIGluIMK1IHRvIHRoZWlyIHBhcmVudCBub2Rlc1xuICpcbiAqIEBwYXJhbSAge1t0eXBlXX0gX2VsIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuTWljcm9iZS5wcm90b3R5cGUucGFyZW50ID0gZnVuY3Rpb24oIF9lbCApXG57XG4gICAgbGV0IF9wYXJlbnQgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICByZXR1cm4gX2VsbS5wYXJlbnROb2RlO1xuICAgIH07XG5cbiAgICBsZXQgcGFyZW50QXJyYXkgPSBbXTtcblxuICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBwYXJlbnRBcnJheS5wdXNoKCBfcGFyZW50KCB0aGlzWyBpIF0gKSApO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTWljcm9iZSggJycsICcnLCBwYXJlbnRBcnJheSApO1xufTtcblxuXG4vKipcbiAqIFJlbW92ZSBFbGVtZW50XG4gKlxuICogcmVtb3ZlcyBhbiBlbGVtZW50IG9yIGVsZW1lbnRzIGZyb20gdGhlIGRvbVxuICpcbiAqIEBwYXJhbSAge1t0eXBlXX0gX2VsIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuTWljcm9iZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oIF9lbCApXG57XG4gICAgbGV0IF9yZW1vdmUgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICByZXR1cm4gX2VsbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBfZWxtICk7XG4gICAgfTtcblxuICAgIGlmICggX2VsIClcbiAgICB7XG4gICAgICAgIF9yZW1vdmUoIF9lbCApO1xuICAgIH1cblxuICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBfcmVtb3ZlKCB0aGlzWyBpIF0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBBbHRlci9HZXQgaW5uZXIgVGV4dFxuICpcbiAqIENoYW5nZXMgdGhlIGlubmVyIHRleHQgdG8gdGhlIHN1cHBsaWVkIHN0cmluZy5cbiAqIElmIHRoZSB2YWx1ZSBpc1xuICogSWYgdGhlIHZhbHVlIGlzIG9taXR0ZWQsIHNpbXBseSByZXR1cm5zIHRoZSBjdXJyZW50IGlubmVyIGh0bWwgdmFsdWUgb2YgdGhlIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtICAgX3ZhbHVlICAgICAgc3RyaW5nICAgICAgICAgIFRleHQgdmFsdWUgKG9wdGlvbmFsKVxuICogQHBhcmFtICAgX2VsICAgICAgICAgSFRNTEVMZW1lbnQgICAgIGVsZW1lbnQgdG8gbW9kaWZ5IChvcHRpb25hbClcbiAqXG4gKiBAcmV0dXJuICBtaXhlZCAoIE1pY3JvYmUgb3Igc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3MpXG4qL1xuTWljcm9iZS5wcm90b3R5cGUudGV4dCA9IGZ1bmN0aW9uICggX3ZhbHVlLCBfZWwpXG57XG4gICAgbGV0IF9zZXRUZXh0ID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgaWYoIGRvY3VtZW50LmFsbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9lbG0uaW5uZXJUZXh0ID0gX3ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgLy8gc3R1cGlkIEZGXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9lbG0udGV4dENvbnRlbnQgPSBfdmFsdWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IF9nZXRUZXh0ID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgaWYoIGRvY3VtZW50LmFsbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBfZWxtLmlubmVyVGV4dDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIC8vIHN0dXBpZCBGRlxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gX2VsbS50ZXh0Q29udGVudDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIF92YWx1ZSApXG4gICAge1xuICAgICAgICBpZiAoIF9lbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9zZXRUZXh0KCBfZWwgKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3NldFRleHQoIHRoaXNbIGkgXSApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbGV0IGFycmF5VGV4dCA9IFtdO1xuICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBhcnJheVRleHQucHVzaCggX2dldFRleHQoIHRoaXNbIGkgXSApICk7XG4gICAgfVxuXG4gICAgaWYgKCBhcnJheVRleHQubGVuZ3RoID09PSAxIClcbiAgICB7XG4gICAgICAgIHJldHVybiBhcnJheVRleHRbMF07XG4gICAgfVxuICAgIHJldHVybiBhcnJheVRleHQ7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qIGpzaGludCBlc25leHQ6IHRydWUqL1xuLyoqXG4gKiBtaWNyb2JlLmNzcy5qc1xuICpcbiAqIEBhdXRob3IgIE1vdXNlIEJyYXVuICAgICAgICAgPG1vdXNlQHNvY2lvbWFudGljLmNvbT5cbiAqIEBhdXRob3IgIE5pY29sYXMgQnJ1Z25lYXV4ICAgPG5pY29sYXMuYnJ1Z25lYXV4QHNvY2lvbWFudGljLmNvbT5cbiAqXG4gKiBAcGFja2FnZSBNaWNyb2JlXG4gKi9cblxuIC8qKlxuICogQWRkIENsYXNzXG4gKlxuICogTWV0aG9kIGFkZHMgdGhlIGdpdmVuIGNsYXNzIGZyb20gdGhlIGN1cnJlbnQgb2JqZWN0IG9yIHRoZSBnaXZlbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSAgIF9jbGFzcyAgICAgIHN0cmluZyAgICAgICBjbGFzcyB0byBhZGRcbiAqIEBwYXJhbSAgIF9lbCAgICAgICAgIEhUTUxFTGVtZW50ICBlbGVtZW50IHRvIG1vZGlmeSAob3B0aW9uYWwpXG4gKlxuICogQHJldHVybiAgTWljcm9iZVxuKi9cbk1pY3JvYmUucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24oIF9jbGFzcywgX2VsIClcbntcbiAgICBsZXQgX2FkZENsYXNzID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgX2VsbS5jbGFzc0xpc3QuYWRkKCBfY2xhc3MgKTtcbiAgICB9O1xuXG4gICAgaWYgKCBfZWwgKVxuICAgIHtcbiAgICAgICAgX2FkZENsYXNzKCBfZWwgKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICB7XG4gICAgICAgIF9hZGRDbGFzcyggdGhpc1sgaSBdICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogQWx0ZXIvR2V0IENTU1xuICpcbiAqIENoYW5nZXMgdGhlIENTUyBieSB3cml0aW5nIHRoZSBnaXZlbiBwcm9wZXJ0eSBhbmQgdmFsdWUgaW5saW5lIHRvIHRoZVxuICogc3VwcGxpZWQgZWxlbWVudHMuIChwcm9wZXJ0aWVzIHNob3VsZCBiZSBzdXBwbGllZCBpbiBqYXZhc2NyaXB0IGZvcm1hdCkuXG4gKiBJZiB0aGUgdmFsdWUgaXMgb21pdHRlZCwgc2ltcGx5IHJldHVybnMgdGhlIGN1cnJlbnQgY3NzIHZhbHVlIG9mIHRoZSBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSAgIF9wcm9wZXJ0eSAgIHN0cmluZyAgICAgICAgICBKUyBmb3JtYXR0ZWQgQ1NTIHByb3BlcnR5XG4gKiBAcGFyYW0gICBfZWwgICAgICAgICBIVE1MRUxlbWVudCAgICAgZWxlbWVudCB0byBtb2RpZnkgKG9wdGlvbmFsKVxuICogQHBhcmFtICAgX3ZhbHVlICAgICAgc3RyaW5nICAgICAgICAgIENTUyB2YWx1ZSAob3B0aW9uYWwpXG4gKlxuICogQHJldHVybiAgbWl4ZWQgKCBNaWNyb2JlIG9yIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmdzKVxuKi9cbk1pY3JvYmUucHJvdG90eXBlLmNzcyA9IGZ1bmN0aW9uICggX3Byb3BlcnR5LCBfdmFsdWUsIF9lbClcbntcbiAgICBsZXQgX3NldENzcyA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIGlmICggX3ZhbHVlID09PSBudWxsIClcbiAgICAgICAge1xuICAgICAgICAgICAgX2VsbS5zdHlsZS5yZW1vdmVQcm9wZXJ0eSggX3Byb3BlcnR5ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBfZWxtLnN0eWxlWyBfcHJvcGVydHkgXSA9IF92YWx1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgX2dldENzcyA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggX2VsbSApLmdldFByb3BlcnR5VmFsdWUoIF9wcm9wZXJ0eSApO1xuICAgIH07XG5cbiAgICBpZiAoIF92YWx1ZSAhPT0gdW5kZWZpbmVkIClcbiAgICB7XG4gICAgICAgIGlmICggX2VsIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3NldENzcyggX2VsICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9zZXRDc3MoIHRoaXNbIGkgXSApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbGV0IHN0eWxlcyA9IFtdO1xuICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBzdHlsZXMucHVzaCggX2dldENzcyggdGhpc1sgaSBdICkgKTtcbiAgICB9XG4gICAgaWYgKCBzdHlsZXMubGVuZ3RoID09PSAxIClcbiAgICB7XG4gICAgICAgIHJldHVybiBzdHlsZXNbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlcztcbn07XG5cblxuLyoqXG4gKiBIYXMgQ2xhc3NcbiAqXG4gKiBNZXRob2QgY2hlY2tzIGlmIHRoZSBjdXJyZW50IG9iamVjdCBvciB0aGUgZ2l2ZW4gZWxlbWVudCBoYXMgdGhlIGdpdmVuIGNsYXNzXG4gKlxuICogQHBhcmFtICAgX2NsYXNzICAgICAgc3RyaW5nICAgICAgIGNsYXNzIHRvIGNoZWNrXG4gKiBAcGFyYW0gICBfZWwgICAgICAgICBIVE1MRUxlbWVudCAgZWxlbWVudCB0byBtb2RpZnkgKG9wdGlvbmFsKVxuICpcbiAqIEByZXR1cm4gIE1pY3JvYmVcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uKCBfY2xhc3MsIF9lbCApXG57XG4gICAgbGV0IF9oYXNDbGFzcyA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIF9lbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCBfY2xhc3MgKTtcbiAgICB9O1xuXG4gICAgaWYgKCBfZWwgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIF9oYXNDbGFzcyggX2VsICk7XG4gICAgfVxuXG4gICAgbGV0IGksIGxlbiwgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoIGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICB7XG4gICAgICAgIHJlc3VsdHMucHVzaCggX2hhc0NsYXNzKCB0aGlzWyBpIF0gKSApO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xufTtcblxuXG4vKipcbiAqIFJlbW92ZSBDbGFzc1xuICpcbiAqIE1ldGhvZCByZW1vdmVzIHRoZSBnaXZlbiBjbGFzcyBmcm9tIHRoZSBjdXJyZW50IG9iamVjdCBvciB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gICBfY2xhc3MgICAgICBzdHJpbmcgICAgICAgY2xhc3MgdG8gcmVtb3ZlXG4gKiBAcGFyYW0gICBfZWwgICAgICAgICBIVE1MRUxlbWVudCAgZWxlbWVudCB0byBtb2RpZnkgKG9wdGlvbmFsKVxuICpcbiAqIEByZXR1cm4gIE1pY3JvYmVcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKCBfY2xhc3MsIF9lbCApXG57XG4gICAgbGV0IF9yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIF9lbG0uY2xhc3NMaXN0LnJlbW92ZSggX2NsYXNzICk7XG4gICAgICAgIGlmICggX2VsbS5jbGFzc0xpc3QubGVuZ3RoID09PSAwIClcbiAgICAgICAge1xuICAgICAgICAgICAgX2VsbS5yZW1vdmVBdHRyaWJ1dGUoICdjbGFzcycgKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIF9lbCApXG4gICAge1xuICAgICAgICBfcmVtb3ZlQ2xhc3MoIF9lbCApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgX3JlbW92ZUNsYXNzKCB0aGlzWyBpIF0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBUb2dnbGUgQ2xhc3NcbiAqXG4gKiBNZXRob2RzIGNhbGxzIHJlbW92ZUNsYXNzIG9yIHJlbW92ZUNsYXNzIGZyb20gdGhlIGN1cnJlbnQgb2JqZWN0IG9yIGdpdmVuXG4gKiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSAgIF9jbGFzcyAgICAgIHN0cmluZyAgICAgICBjbGFzcyB0byBhZGRcbiAqIEBwYXJhbSAgIF9lbCAgICAgICAgIEhUTUxFTGVtZW50ICBlbGVtZW50IHRvIG1vZGlmeSAob3B0aW9uYWwpXG4gKlxuICogQHJldHVybiAgTWljcm9iZVxuKi9cbk1pY3JvYmUucHJvdG90eXBlLnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24gKCBfY2xhc3MsIF9lbCApXG57XG4gICAgbGV0IF90b2dnbGVDbGFzcyA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIGlmICggX2VsbS5jbGFzc0xpc3QuY29udGFpbnMoIF9jbGFzcyApIClcbiAgICAgICAge1xuICAgICAgICAgICAgX2VsbS5jbGFzc0xpc3QuYWRkKCBfY2xhc3MgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9lbG0uY2xhc3NMaXN0LnJlbW92ZSggX2NsYXNzICk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCBfZWwgKVxuICAgIHtcbiAgICAgICAgX3RvZ2dsZUNsYXNzKCBfZWwgKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICB7XG4gICAgICAgIF90b2dnbGVDbGFzcyggdGhpc1sgaSBdICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qIGpzaGludCBlc25leHQ6IHRydWUqL1xuLyoqXG4gKiBtaWNyb2JlLmV2ZW50cy5qc1xuICpcbiAqIEBhdXRob3IgIE1vdXNlIEJyYXVuICAgICAgICAgPG1vdXNlQHNvY2lvbWFudGljLmNvbT5cbiAqIEBhdXRob3IgIE5pY29sYXMgQnJ1Z25lYXV4ICAgPG5pY29sYXMuYnJ1Z25lYXV4QHNvY2lvbWFudGljLmNvbT5cbiAqXG4gKiBAcGFja2FnZSBNaWNyb2JlXG4gKi9cblxuIC8qKlxuICogQmluZCBFdmVudHNcbiAqXG4gKiBNZXRob2RzIGJpbmRzIGFuIGV2ZW50IHRvIHRoZSBIVE1MRWxlbWVudHMgb2YgdGhlIGN1cnJlbnQgb2JqZWN0IG9yIHRvIHRoZVxuICogZ2l2ZW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gICBfZXZlbnQgICAgICBzdHJpbmcgICAgICAgICAgSFRNTEV2ZW50XG4gKiBAcGFyYW0gICBfY2FsbGJhY2sgICBmdW5jdGlvbiAgICAgICAgY2FsbGJhY2sgZnVuY3Rpb25cbiAqIEBwYXJhbSAgIF9lbCAgICAgICAgIEhUTUxFTGVtZW50ICAgICBlbGVtZW50IHRvIG1vZGlmeSAob3B0aW9uYWwpXG4gKlxuICogQHJldHVybiAgTWljcm9iZVxuKi9cbk1pY3JvYmUucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoIF9ldmVudCwgX2NhbGxiYWNrLCBfZWwgKVxue1xuICAgIGxldCBfYmluZCA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIGlmICggIV9lbG0uYWRkRXZlbnRMaXN0ZW5lciApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9lbG0uYXR0YWNoRXZlbnQoIF9ldmVudCwgX2NhbGxiYWNrICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBfZWxtLmFkZEV2ZW50TGlzdGVuZXIoIF9ldmVudCwgX2NhbGxiYWNrICk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCBfZWwgKVxuICAgIHtcbiAgICAgICAgX2JpbmQoIF9lbCApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgX2JpbmQoIHRoaXNbIGkgXSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG5cbiAvKipcbiAqIFVuYmluZCBFdmVudHNcbiAqXG4gKiBNZXRob2RzIHVuYmluZHMgYW4gZXZlbnQgZnJvbSB0aGUgSFRNTEVsZW1lbnRzIG9mIHRoZSBjdXJyZW50IG9iamVjdCBvciB0byB0aGVcbiAqIGdpdmVuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtICAgX2V2ZW50ICAgICAgc3RyaW5nICAgICAgICAgIEhUTUxFdmVudFxuICogQHBhcmFtICAgX2NhbGxiYWNrICAgZnVuY3Rpb24gICAgICAgIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKiBAcGFyYW0gICBfZWwgICAgICAgICBIVE1MRUxlbWVudCAgICAgZWxlbWVudCB0byBtb2RpZnkgKG9wdGlvbmFsKVxuICpcbiAqIEByZXR1cm4gIE1pY3JvYmVcbiovXG5NaWNyb2JlLnByb3RvdHlwZS51bmJpbmQgPSBmdW5jdGlvbiAoIF9ldmVudCwgX2NhbGxiYWNrLCBfZWwgKVxue1xuICAgIGxldCBfdW5iaW5kID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgX2VsbS5yZW1vdmVFdmVudExpc3RlbmVyKCBfZXZlbnQsIF9jYWxsYmFjayApO1xuICAgIH07XG5cbiAgICBpZiAoIF9lbCApXG4gICAge1xuICAgICAgICBfdW5iaW5kKCBfZWwgKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICB7XG4gICAgICAgIF91bmJpbmQoIHRoaXNbIGkgXSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG4vKlxuICogUmVhZHlcbiAqXG4gKiBNZXRob2RzIGRldGVjdHMgaWYgdGhlIERPTSBpcyByZWFkeS5cbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEyMDcwMDVcbiAqXG4gKiBAcmV0dXJuICB2b2lkXG4qL1xuTWljcm9iZS5wcm90b3R5cGUucmVhZHkgPSBmdW5jdGlvbiggX2NhbGxiYWNrIClcbntcbiAgICAvKiBNb3ppbGxhLCBDaHJvbWUsIE9wZXJhICovXG4gICAgaWYgKCBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyIClcbiAgICB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgX2NhbGxiYWNrLCBmYWxzZSApO1xuICAgIH1cbiAgICAvKiBTYWZhcmksIGlDYWIsIEtvbnF1ZXJvciAqL1xuICAgIGlmICggL0tIVE1MfFdlYktpdHxpQ2FiL2kudGVzdCggbmF2aWdhdG9yLnVzZXJBZ2VudCApIClcbiAgICB7XG4gICAgICAgIGxldCBET01Mb2FkVGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIC9sb2FkZWR8Y29tcGxldGUvaS50ZXN0KCBkb2N1bWVudC5yZWFkeVN0YXRlICkgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9jYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoIERPTUxvYWRUaW1lciApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMCk7XG4gICAgfVxuICAgIC8qIE90aGVyIHdlYiBicm93c2VycyAqL1xuICAgIHdpbmRvdy5vbmxvYWQgPSBfY2FsbGJhY2s7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qIGpzaGludCBlc25leHQ6IHRydWUqL1xuLyogZ2xvYmFscyBQcm9taXNlICovXG4vKipcbiAqIG1pY3JvYmUuaHR0cC5qc1xuICpcbiAqIEBhdXRob3IgIE1vdXNlIEJyYXVuICAgICAgICAgPG1vdXNlQHNvY2lvbWFudGljLmNvbT5cbiAqIEBhdXRob3IgIE5pY29sYXMgQnJ1Z25lYXV4ICAgPG5pY29sYXMuYnJ1Z25lYXV4QHNvY2lvbWFudGljLmNvbT5cbiAqXG4gKiBAcGFja2FnZSBNaWNyb2JlXG4gKi9cblxuXG5NaWNyb2JlLnByb3RvdHlwZS5odHRwID0gZnVuY3Rpb24oIF9wYXJhbWV0ZXJzIClcbntcbiAgICByZXR1cm4gbmV3IFByb21pc2UoIGZ1bmN0aW9uKCByZXNvbHZlLCByZWplY3QgKVxuICAgIHtcbiAgICAgICAgaWYgKCAhX3BhcmFtZXRlcnMgKSB7IHJlamVjdCggbmV3IEVycm9yKCAnTm8gcGFyYW1ldGVycyBnaXZlbicgKSApOyB9XG4gICAgICAgIGlmICggdHlwZW9mIF9wYXJhbWV0ZXJzID09PSAnc3RyaW5nJyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9wYXJhbWV0ZXJzID0geyB1cmw6IF9wYXJhbWV0ZXJzIH07XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVxICAgICAgICAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgbGV0IG1ldGhvZCAgICAgID0gX3BhcmFtZXRlcnMubWV0aG9kIHx8ICdHRVQnO1xuICAgICAgICBsZXQgdXJsICAgICAgICAgPSBfcGFyYW1ldGVycy51cmw7XG4gICAgICAgIGxldCBkYXRhICAgICAgICA9IEpTT04uc3RyaW5naWZ5KCBfcGFyYW1ldGVycy5kYXRhICkgfHwgbnVsbDtcbiAgICAgICAgbGV0IHVzZXIgICAgICAgID0gX3BhcmFtZXRlcnMudXNlciB8fCAnJztcbiAgICAgICAgbGV0IHBhc3N3b3JkICAgID0gX3BhcmFtZXRlcnMucGFzc3dvcmQgfHwgJyc7XG4gICAgICAgIGxldCBoZWFkZXJzICAgICA9IF9wYXJhbWV0ZXJzLmhlYWRlcnMgIHx8IG51bGw7XG5cbiAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCByZXEucmVhZHlTdGF0ZSA9PT0gNCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVxLm9uZXJyb3IgPSBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlamVjdCggbmV3IEVycm9yKCAnTmV0d29yayBlcnJvciEnICkgKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXEub3BlbiggbWV0aG9kLCB1cmwsIHRydWUsIHVzZXIsIHBhc3N3b3JkICk7XG5cbiAgICAgICAgaWYgKCBoZWFkZXJzIClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCBBcnJheS5pc0FycmF5KCBoZWFkZXJzICkgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gaGVhZGVycy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlciggaGVhZGVyc1tpXS5oZWFkZXIsIGhlYWRlcnNbaV0udmFsdWUgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoIGhlYWRlcnMuaGVhZGVyLCBoZWFkZXJzLnZhbHVlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXEuc2VuZCggZGF0YSApO1xuICAgICAgICByZXEub25sb2FkID0gZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIHJlcS5zdGF0dXMgPT09IDIwMCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggcmVxLnJlc3BvbnNlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCBuZXcgRXJyb3IoIHJlcS5zdGF0dXMgKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xufTtcblxuTWljcm9iZS5wcm90b3R5cGUuaHR0cC5nZXQgPSBmdW5jdGlvbiggX3VybCApXG57XG4gICAgcmV0dXJuIHRoaXMoe1xuICAgICAgICB1cmwgICAgIDogX3VybCxcbiAgICAgICAgbWV0aG9kICA6ICdHRVQnXG4gICAgfSk7XG59O1xuXG5NaWNyb2JlLnByb3RvdHlwZS5odHRwLnBvc3QgPSBmdW5jdGlvbiggX3VybCwgX2RhdGEgKVxue1xuICAgIHJldHVybiB0aGlzKHtcbiAgICAgICAgdXJsICAgICA6IF91cmwsXG4gICAgICAgIGRhdGEgICAgOiBfZGF0YSxcbiAgICAgICAgbWV0aG9kICA6ICdQT1NUJ1xuICAgIH0pO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKiBqc2hpbnQgZXNuZXh0OiB0cnVlKi9cbi8qKlxuICogbWljcm9iZS5tYWluLmpzXG4gKlxuICogQGF1dGhvciAgTW91c2UgQnJhdW4gICAgICAgICA8bW91c2VAc29jaW9tYW50aWMuY29tPlxuICogQGF1dGhvciAgTmljb2xhcyBCcnVnbmVhdXggICA8bmljb2xhcy5icnVnbmVhdXhAc29jaW9tYW50aWMuY29tPlxuICpcbiAqIEBwYWNrYWdlIE1pY3JvYmVcbiAqL1xuXG4gLyoqXG4gKiDCtSBjb25zdHJ1Y3RvclxuICpcbiAqIGJ1aWxkcyB0aGUgwrUgb2JqZWN0XG4gKlxuICogQHJldHVybiDCtVxuICovXG5sZXQgwrUgPSAoZnVuY3Rpb24oKVxue1xuICAgIGxldCBpbm5lciA9IGZ1bmN0aW9uKCBzZWxlY3Rvciwgc2NvcGUgKVxuICAgIHtcbiAgICAgICAgbGV0IG1pY3JvYmVJbm5lciA9IG5ldyBNaWNyb2JlKCBzZWxlY3Rvciwgc2NvcGUgKTtcblxuICAgICAgICByZXR1cm4gbWljcm9iZUlubmVyO1xuICAgIH07XG5cbiAgICBmb3IoIGxldCBwcm9wIGluIE1pY3JvYmUucHJvdG90eXBlIClcbiAgICB7XG4gICAgICAgIGlmICggTWljcm9iZS5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoIHByb3AgKSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlubmVyWyBwcm9wIF0gPSBNaWNyb2JlLnByb3RvdHlwZVsgcHJvcCBdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGlubmVyO1xufSgpKTtcblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuIiwiJHRyYWNldXJSdW50aW1lLnNldFByb3BlcnR5KCRfX3BsYWNlaG9sZGVyX18wLFxuICAgICAgICAgICRfX3BsYWNlaG9sZGVyX18xLCAkX19wbGFjZWhvbGRlcl9fMikiLCIkX19wbGFjZWhvbGRlcl9fMFskdHJhY2V1clJ1bnRpbWUudG9Qcm9wZXJ0eSgkX19wbGFjZWhvbGRlcl9fMSldIiwidmFyICRfX3BsYWNlaG9sZGVyX18wID0gJF9fcGxhY2Vob2xkZXJfXzEiLCIoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKSgkX19wbGFjZWhvbGRlcl9fMCwgJF9fcGxhY2Vob2xkZXJfXzEsICRfX3BsYWNlaG9sZGVyX18yKSIsIlxuICAgICAgICBmb3IgKHZhciAkX19wbGFjZWhvbGRlcl9fMCA9XG4gICAgICAgICAgICAgICAgICRfX3BsYWNlaG9sZGVyX18xW1N5bWJvbC5pdGVyYXRvcl0oKSxcbiAgICAgICAgICAgICAgICAgJF9fcGxhY2Vob2xkZXJfXzI7XG4gICAgICAgICAgICAgISgkX19wbGFjZWhvbGRlcl9fMyA9ICRfX3BsYWNlaG9sZGVyX180Lm5leHQoKSkuZG9uZTsgKSB7XG4gICAgICAgICAgJF9fcGxhY2Vob2xkZXJfXzU7XG4gICAgICAgICAgJF9fcGxhY2Vob2xkZXJfXzY7XG4gICAgICAgIH0iLCIkdHJhY2V1clJ1bnRpbWUuaW5pdEdlbmVyYXRvckZ1bmN0aW9uKCRfX3BsYWNlaG9sZGVyX18wKSIsInZhciAkYXJndW1lbnRzID0gYXJndW1lbnRzOyIsInJldHVybiAkX19wbGFjZWhvbGRlcl9fMChcbiAgICAgICAgICAgICAgJF9fcGxhY2Vob2xkZXJfXzEsXG4gICAgICAgICAgICAgICRfX3BsYWNlaG9sZGVyX18yLCB0aGlzKTsiLCIkdHJhY2V1clJ1bnRpbWUuY3JlYXRlR2VuZXJhdG9ySW5zdGFuY2UiLCJmdW5jdGlvbigkY3R4KSB7XG4gICAgICB3aGlsZSAodHJ1ZSkgJF9fcGxhY2Vob2xkZXJfXzBcbiAgICB9IiwiJGN0eC5zdGF0ZSA9ICgkX19wbGFjZWhvbGRlcl9fMCkgPyAkX19wbGFjZWhvbGRlcl9fMSA6ICRfX3BsYWNlaG9sZGVyX18yO1xuICAgICAgICBicmVhayIsInJldHVybiAkX19wbGFjZWhvbGRlcl9fMCIsIiRjdHgubWF5YmVUaHJvdygpIiwicmV0dXJuICRjdHguZW5kKCkiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=