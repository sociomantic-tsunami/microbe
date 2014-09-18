"use strict";
var Microbe = function Microbe(_selector) {
  var _scope = arguments[1] !== (void 0) ? arguments[1] : document;
  var _elements = arguments[2] !== (void 0) ? arguments[2] : null;
  var elements;
  if (_selector.nodeType === 1) {
    return this.create(_selector);
  }
  if (/^<.+>$/.test(_selector)) {
    return this.create(_selector.substring(1, _selector.length - 1));
  }
  if (_elements) {
    if (Array.isArray(_elements)) {
      elements = _elements;
    } else {
      elements = [_elements];
    }
  } else {
    elements = (_scope).querySelectorAll(_selector);
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
  if (Object.prototype.toString.call(_el) === '[object String]') {
    try {
      throw undefined;
    } catch (classArray) {
      try {
        throw undefined;
      } catch (_classes) {
        try {
          throw undefined;
        } catch (_ids) {
          {
            _classes = '';
            if (_el.indexOf('#') !== -1) {
              if (_ids === undefined) {
                _ids = _el;
              }
              _ids = _el.split('#')[1];
              _ids = _ids.split('.')[0];
            }
            classArray = _el.split('.');
            {
              try {
                throw undefined;
              } catch ($len) {
                try {
                  throw undefined;
                } catch ($i) {
                  {
                    {
                      $i = 1;
                      $len = classArray.length;
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
                              if (classArray[$traceurRuntime.toProperty(i)].indexOf('#') === -1) {
                                _classes += ' ' + classArray[$traceurRuntime.toProperty(i)];
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
            _classes = _classes.trim();
            _el = _el.split(/[#.]/)[0];
            _el = document.createElement(_el);
            if (_classes !== '') {
              _el.className = _classes;
            }
            if (_ids) {
              _el.id = _ids.trim();
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
    _elm.className += _elm.className.length > 0 ? ' ' + _class : _class;
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
  var classRegex = new RegExp('(^|\\s)' + _class + '(\\s|$)', 'g');
  var _hasClass = function(_elm) {
    return !!_elm.className.match(classRegex);
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
  var classRegex = new RegExp('(?:^| +)' + _class + ' *(?= +|$)', 'g');
  var _removeClass = function(_elm) {
    _elm.className = _elm.className.replace(classRegex, '').trim();
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
    if (_elm.className.indexOf(_class) > -1) {
      Microbe.removeClass(_class, _elm);
    } else {
      Microbe.addClass(_class, _elm);
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
      reject(Error('No parameters given'));
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
      reject(Error('Network error!'));
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
        reject(Error(req.status));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1pY3JvYmUudHJhY2V1ci5qcyIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8xNSIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8xNCIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8zIiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzIiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvNCIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8xMyIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci83IiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzEyIiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzUiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvMTEiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvOCIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci85IiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzYiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvMTAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBY0E7WUFBQSxTQUFNLFFBQU0sQ0FnQkssU0FBUSxBQUFpQztJQUE5QixPQUFLLDZDQUFFLFNBQU87SUFBRyxVQUFRLDZDQUFFLEtBQUc7SUFFOUMsQ0FBQSxRQUFPO0FBRVgsS0FBSyxTQUFRLFNBQVMsSUFBTSxFQUFBLENBQzVCO0FBQ0ksU0FBTyxDQUFBLElBQUcsT0FBTyxBQUFDLENBQUUsU0FBUSxDQUFFLENBQUM7RUFDbkM7QUFBQSxBQUVBLEtBQUssUUFBTyxLQUFLLEFBQUMsQ0FBRSxTQUFRLENBQUUsQ0FDOUI7QUFDSSxTQUFPLENBQUEsSUFBRyxPQUFPLEFBQUMsQ0FBRSxTQUFRLFVBQVUsQUFBQyxDQUFF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cENHLElBQUcsQ0UzcENZLENBQUMsQ0RDakIsQ0QwcENPO1FBQzdDO0FBQUE7OztBQUdKLE9BQU8sTUFBSSxDQUFDO0FBQ2hCLEFBQUMsRUFBQyxDQUFDO0FBSUgiLCJmaWxlIjoibWljcm9iZS50cmFjZXVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4vKipcbiAqIG1pY3JvYmUuanNcbiAqXG4gKiBAYXV0aG9yICBNb3VzZSBCcmF1biAgICAgICAgIDxtb3VzZUBzb2Npb21hbnRpYy5jb20+XG4gKiBAYXV0aG9yICBOaWNvbGFzIEJydWduZWF1eCAgIDxuaWNvbGFzLmJydWduZWF1eEBzb2Npb21hbnRpYy5jb20+XG4gKlxuICogQHBhY2thZ2UgTWljcm9iZVxuICovXG5cbi8qKlxuICogQ2xhc3MgTWljcm9iZVxuICovXG5jbGFzcyBNaWNyb2JlXG57XG4gICAgLypcbiAgICAqIENvbnN0cnVjdG9yLlxuICAgICogRWl0aGVyIHNlbGVjdHMgb3IgY3JlYXRlcyBhbiBIVE1MIGVsZW1lbnQgYW5kIHdyYXBzIGluIGludG8gYW4gTWljcm9iZVxuICAgICogaW5zdGFuY2UuXG4gICAgKiBVc2FnZTogICDCtSgnZGl2I3Rlc3QnKSAgIC0tLT4gc2VsZWN0aW9uXG4gICAgKiAgICAgICAgICDCtSgnPGRpdiN0ZXN0PicpIC0tLT4gY3JlYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0gICBfc2VsZWN0b3IgICBzdHJpbmcgb3IgSFRNTEVsZW1lbnQgICBIVE1MIHNlbGVjdG9yXG4gICAgKiBAcGFyYW0gICBfc2NvcGUgICAgICBIVE1MRWxlbWVudCAgICAgICAgICAgICBzY29wZSB0byBsb29rIGluc2lkZVxuICAgICogQHBhcmFtICAgX2VsZW1lbnRzICAgSFRNTEVsZW1lbnQocykgICAgICAgICAgZWxlbWVudHMgdG8gZmlsbCBNaWNyb2JlIHdpdGhcbiAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvcHRpb25hbClcbiAgICAqXG4gICAgKiBAcmV0dXJuICBNaWNyb2JlXG4gICAgKi9cbiAgICBjb25zdHJ1Y3RvciggX3NlbGVjdG9yLCBfc2NvcGU9ZG9jdW1lbnQsIF9lbGVtZW50cz1udWxsIClcbiAgICB7XG4gICAgICAgIGxldCBlbGVtZW50cztcblxuICAgICAgICBpZiAoIF9zZWxlY3Rvci5ub2RlVHlwZSA9PT0gMSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZSggX3NlbGVjdG9yICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIC9ePC4rPiQvLnRlc3QoIF9zZWxlY3RvciApIClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKCBfc2VsZWN0b3Iuc3Vic3RyaW5nKCAxLCBfc2VsZWN0b3IubGVuZ3RoIC0gMSApICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIF9lbGVtZW50cyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggQXJyYXkuaXNBcnJheSggX2VsZW1lbnRzICkgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gX2VsZW1lbnRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gWyBfZWxlbWVudHMgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGVsZW1lbnRzID0gKCBfc2NvcGUgKS5xdWVyeVNlbGVjdG9yQWxsKCBfc2VsZWN0b3IgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGVuZ3RoID0gZWxlbWVudHMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzWyBpIF0gPSBlbGVtZW50c1sgaSBdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKCBsZXQgcHJvcCBpbiBNaWNyb2JlLnByb3RvdHlwZSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggTWljcm9iZS5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoIHByb3AgKSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHNbIHByb3AgXSA9IE1pY3JvYmUucHJvdG90eXBlWyBwcm9wIF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAqIEZvciBlYWNoXG4gICAgKlxuICAgICogTWV0aG9kcyBpdGVyYXRlcyB0aHJvdWdoIGFsbCB0aGUgZWxlbWVudHMgYW4gZXhlY3V0ZSB0aGUgZnVuY3Rpb24gb24gZWFjaCBvZlxuICAgICogdGhlbVxuICAgICpcbiAgICAqIEByZXR1cm4gIEFycmF5XG4gICAgKi9cbiAgICBlYWNoKCBfdGFyZ2V0LCBfY2FsbGJhY2sgKVxuICAgIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgX3RhcmdldCA9PT0gJ2Z1bmN0aW9uJyAmJiAhX2NhbGxiYWNrIClcbiAgICAgICAge1xuICAgICAgICAgICAgX2NhbGxiYWNrID0gX3RhcmdldDtcbiAgICAgICAgICAgIF90YXJnZXQgICA9IHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAoIGxldCBpdGVtIG9mIHRoaXMuaXRlcmF0b3IoIF90YXJnZXQgKSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9jYWxsYmFjayggaXRlbSwgaSsrICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RhcmdldDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICogSXRlcmF0b3JcbiAgICAqXG4gICAgKiBHZW5lcmF0b3IgeWllbGRzIG5leHQgZWxlbWVudCBvZiB0aGUgaXRlcmFibGUgb2JqZWN0IGdpdmVuIGluIHBhcmFtZXRlci5cbiAgICAqXG4gICAgKiBAcGFyYW0gIHtpdGVyYWJsZX0gICAgICBfaXRlcmFibGUgb2JqZWN0IHRvIGl0ZXJhdGUgdGhyb3VnaFxuICAgICogQHlpZWxkICB7bWl4ZWR9ICAgICAgICAgd2hhdCdzIGluc2lkZSB0aGUgbmV4dCBpbmRleFxuICAgICovXG4gICAgKiBpdGVyYXRvciggX2l0ZXJhYmxlPXRoaXMgKVxuICAgIHtcbiAgICAgICAgbGV0IG5leHRJbmRleCA9IDA7XG5cbiAgICAgICAgd2hpbGUoIG5leHRJbmRleCA8IF9pdGVyYWJsZS5sZW5ndGggKVxuICAgICAgICB7XG4gICAgICAgICAgICB5aWVsZCBfaXRlcmFibGVbbmV4dEluZGV4KytdO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAqIGNoZWNrIG1pY3JvXG4gICAgKlxuICAgICogdGhpcyBjaGVjayBpZiBzb21ldGhpbmcgaXMgYSBNaWNyb2JlIG9iamVjdC4gIG1pY3JvYmVzIGFyZSByZXR1cm5lZC4gZWxlbWVudHMgYXJlXG4gICAgKiB3cmFwcGVkIGludG8gbWljcm9iZSBvYmplY3RzLiBTdHJpbmdzIGFyZSBidWlsdCB1c2luZyB0aGUgY3JlYXRlIG1ldGhvZCwgdGhlbiB3cmFwcGVkXG4gICAgKiBpbnRvIG1pY3JvYmVzIGFuZCByZXR1cm5lZC5cbiAgICAqXG4gICAgKiBAcGFyYW0gIHthbnl0aGluZ30gX29iaiBvYmplY3QgdG8gY2hlY2sgdHlwZVxuICAgICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgbWljcm9iZSBvYmplY3RcbiAgICAqL1xuICAgIG1pY3JvKCBfb2JqIClcbiAgICB7XG4gICAgICAgIGlmICggX29iai50eXBlID09PSAnW29iamVjdCBNaWNyb2JlXScgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIC9ePC4rPiQvLnRlc3QoIF9vYmogKSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKCBfb2JqLnN1YnN0cmluZyggMSwgX29iai5sZW5ndGggLSAxICkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE1pY3JvYmUoIF9vYmogKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfb2JqO1xuICAgIH1cblxuXG4gICAvKipcbiAgICAqIFRvIGFycmF5XG4gICAgKlxuICAgICogTWV0aG9kcyByZXR1cm5zIGFsbCB0aGUgZWxlbWVudHMgaW4gYW4gYXJyYXkuXG4gICAgKlxuICAgICogQHJldHVybiAgQXJyYXlcbiAgICAqL1xuICAgIHRvQXJyYXkoKVxuICAgIHtcbiAgICAgICAgbGV0IGFyciA9IFtdO1xuICAgICAgICBmb3IgKCBsZXQgaXRlbSBvZiB0aGlzLml0ZXJhdG9yKCkgKVxuICAgICAgICB7XG4gICAgICAgICAgICBhcnIucHVzaCggaXRlbSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfVxufVxuXG5NaWNyb2JlLnByb3RvdHlwZS50eXBlID0gJ1tvYmplY3QgTWljcm9iZV0nO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoganNoaW50IGVzbmV4dDogdHJ1ZSovXG4vKipcbiAqIG1pY3JvYmUuaHRtbC5qc1xuICpcbiAqIEBhdXRob3IgIE1vdXNlIEJyYXVuICAgICAgICAgPG1vdXNlQHNvY2lvbWFudGljLmNvbT5cbiAqIEBhdXRob3IgIE5pY29sYXMgQnJ1Z25lYXV4ICAgPG5pY29sYXMuYnJ1Z25lYXV4QHNvY2lvbWFudGljLmNvbT5cbiAqXG4gKiBAcGFja2FnZSBNaWNyb2JlXG4gKi9cblxuXG4vKipcbiAqIEFwcGVuZCBFbGVtZW50XG4gKlxuICogQHBhcmFtICB7W3R5cGVdfSBfZWxlICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gX3BhcmVudCBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5NaWNyb2JlLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiggX2VsLCBfcGFyZW50IClcbntcbiAgICBsZXQgX2FwcGVuZCA9IGZ1bmN0aW9uKCBfcGFyZW50RWwsIF9lbG0gKVxuICAgIHtcbiAgICAgICAgaWYgKCBfZWxtIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3BhcmVudEVsLmFwcGVuZENoaWxkKCBfZWxtICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBfcGFyZW50RWwuYXBwZW5kQ2hpbGQoIF9lbCApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGlmICggX3BhcmVudCApXG4gICAge1xuICAgICAgICBfYXBwZW5kKCBfcGFyZW50ICk7XG4gICAgfVxuICAgIGlmICghX2VsLmxlbmd0aCApXG4gICAge1xuICAgICAgICBfZWwgPSBbIF9lbCBdO1xuICAgIH1cblxuICAgIGZvciAoIGxldCBpID0gMCwgbGVuaSA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuaTsgaSsrIClcbiAgICB7XG4gICAgICAgIGZvciAoIGxldCBqID0gMCwgbGVuaiA9IF9lbC5sZW5ndGg7IGogPCBsZW5qOyBqKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIGkgIT09IDAgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9hcHBlbmQoIHRoaXNbIGkgXSwgX2VsWyBqIF0uY2xvbmVOb2RlKHRydWUpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2FwcGVuZCggdGhpc1sgaSBdLCBfZWxbIGogXSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG5cbn07XG5cblxuIC8qKlxuICogQWx0ZXIvR2V0IEF0dHJpYnV0ZVxuICpcbiAqIENoYW5nZXMgdGhlIGF0dHJpYnV0ZSBieSB3cml0aW5nIHRoZSBnaXZlbiBwcm9wZXJ0eSBhbmQgdmFsdWUgdG8gdGhlXG4gKiBzdXBwbGllZCBlbGVtZW50cy4gKHByb3BlcnRpZXMgc2hvdWxkIGJlIHN1cHBsaWVkIGluIGphdmFzY3JpcHQgZm9ybWF0KS5cbiAqIElmIHRoZSB2YWx1ZSBpcyBvbWl0dGVkLCBzaW1wbHkgcmV0dXJucyB0aGUgY3VycmVudCBhdHRyaWJ1dGUgdmFsdWUgIG9mIHRoZVxuICogZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gICBfYXR0cmlidXRlICBzdHJpbmcgICAgICAgICAgIEpTIGZvcm1hdHRlZCBDU1MgcHJvcGVydHlcbiAqIEBwYXJhbSAgIF9lbCAgICAgICAgIEhUTUxFTGVtZW50ICAgICAgZWxlbWVudCB0byBtb2RpZnkgKG9wdGlvbmFsKVxuICogQHBhcmFtICAgX3ZhbHVlICAgICAgc3RyaW5nICAgICAgICAgICBDU1MgdmFsdWUgKG9wdGlvbmFsKVxuICpcbiAqIEByZXR1cm4gIG1peGVkICggTWljcm9iZSBvciBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncylcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24gKCBfYXR0cmlidXRlLCBfdmFsdWUsIF9lbClcbntcbiAgICBsZXQgX3NldEF0dHI7XG4gICAgbGV0IF9nZXRBdHRyO1xuICAgIGxldCBfcmVtb3ZlQXR0cjtcblxuICAgIF9zZXRBdHRyID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgaWYgKCBfdmFsdWUgPT09IG51bGwgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfcmVtb3ZlQXR0ciggX2VsbSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCAhX2VsbS5nZXRBdHRyaWJ1dGUgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9lbG1bIF9hdHRyaWJ1dGUgXSA9IF92YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfZWxtLnNldEF0dHJpYnV0ZSggX2F0dHJpYnV0ZSwgX3ZhbHVlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgX2dldEF0dHIgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICBpZiAoIF9lbG0uZ2V0QXR0cmlidXRlKCBfYXR0cmlidXRlICkgPT09IG51bGwgKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gX2VsbVsgX2F0dHJpYnV0ZSBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZWxtLmdldEF0dHJpYnV0ZSggX2F0dHJpYnV0ZSApO1xuICAgIH07XG5cbiAgICBfcmVtb3ZlQXR0ciA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIGlmICggX2VsbS5nZXRBdHRyaWJ1dGUoIF9hdHRyaWJ1dGUgKSA9PT0gbnVsbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRlbGV0ZSBfZWxtWyBfYXR0cmlidXRlIF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBfZWxtLnJlbW92ZUF0dHJpYnV0ZSggX2F0dHJpYnV0ZSApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGlmICggX3ZhbHVlICE9PSB1bmRlZmluZWQgKVxuICAgIHtcbiAgICAgICAgaWYgKCBfZWwgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfc2V0QXR0ciggX2VsICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9zZXRBdHRyKCB0aGlzWyBpIF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxldCBhdHRyaWJ1dGVzID0gW107XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKCBfZ2V0QXR0ciggdGhpc1sgaSBdICkgKTtcbiAgICB9XG5cbiAgICBpZiAoIGF0dHJpYnV0ZXMubGVuZ3RoID09PSAxIClcbiAgICB7XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzWzBdO1xuICAgIH1cblxuICAgIHJldHVybiBhdHRyaWJ1dGVzO1xufTtcblxuXG4vKipcbiAqIEdldCBDaGlsZHJlblxuICpcbiAqIGdldHMgYW4gYXJyYXkgb3IgYWxsIHRoZSBnaXZlbiBlbGVtZW50J3MgY2hpbGRyZW5cbiAqXG4gKiBAcGFyYW0gIHtbdHlwZV19IF9lbCBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbk1pY3JvYmUucHJvdG90eXBlLmNoaWxkcmVuID0gZnVuY3Rpb24oIF9lbCApXG57XG4gICAgbGV0IF9jaGlsZHJlbiA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIHJldHVybiBfZWxtLmNoaWxkcmVuO1xuICAgIH07XG5cbiAgICBsZXQgY2hpbGRyZW5BcnJheSA9IFtdO1xuXG4gICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICB7XG4gICAgICAgIGNoaWxkcmVuQXJyYXkucHVzaCggX2NoaWxkcmVuKCB0aGlzWyBpIF0gKSApO1xuICAgIH1cblxuICAgIGlmICggY2hpbGRyZW5BcnJheS5sZW5ndGggPT09IDEgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuQXJyYXlbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkcmVuQXJyYXk7XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlIEVsZW1lbnRcbiAqXG4gKiBNZXRob2QgY3JlYXRlcyBhIE1pY3JvYmUgZnJvbSBhbiBlbGVtZW50IG9yIGEgbmV3IGVsZW1lbnQgb2YgdGhlIHBhc3NlZCBzdHJpbmcsIGFuZFxuICogcmV0dXJucyB0aGUgTWljcm9iZVxuICpcbiAqIEBwYXJhbSAgIF9lbCAgICAgICAgIEhUTUxFTGVtZW50ICAgICBlbGVtZW50IHRvIGNyZWF0ZVxuICpcbiAqIEByZXR1cm4gIE1pY3JvYmVcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoIF9lbCApXG57XG4gICAgaWYgKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIF9lbCApID09PSAnW29iamVjdCBTdHJpbmddJyApXG4gICAge1xuICAgICAgICBsZXQgX2lkcywgX2NsYXNzZXMgPSAnJztcblxuICAgICAgICBpZiAoIF9lbC5pbmRleE9mKCAnIycgKSAhPT0gLTEgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIF9pZHMgPT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkcyA9IF9lbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9pZHMgICAgID0gX2VsLnNwbGl0KCAnIycgKVsgMSBdO1xuICAgICAgICAgICAgX2lkcyAgICAgPSBfaWRzLnNwbGl0KCAnLicgKVsgMCBdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNsYXNzQXJyYXkgPSBfZWwuc3BsaXQoICcuJyApO1xuXG4gICAgICAgIGZvciAoIGxldCBpID0gMSwgbGVuID0gY2xhc3NBcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggY2xhc3NBcnJheVsgaSBdLmluZGV4T2YoICcjJyApID09PSAtMSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2NsYXNzZXMgKz0gJyAnICsgY2xhc3NBcnJheVsgaSBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9jbGFzc2VzID0gX2NsYXNzZXMudHJpbSgpO1xuXG4gICAgICAgIF9lbCA9IF9lbC5zcGxpdCggL1sjLl0vIClbIDAgXTtcblxuICAgICAgICBfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBfZWwgKTtcblxuICAgICAgICBpZiAoIF9jbGFzc2VzICE9PSAnJyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9lbC5jbGFzc05hbWUgPSBfY2xhc3NlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggX2lkcyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9lbC5pZCA9IF9pZHMudHJpbSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBNaWNyb2JlKCcnLCAnJywgX2VsICk7XG59O1xuXG5cbi8qKlxuICogR2V0IEZpcnN0IEVsZW1lbnRcbiAqXG4gKiBNZXRob2RzIGdldHMgdGhlIGZpcnN0IEhUTUwgRWxlbWVudHMgb2YgdGhlIGN1cnJlbnQgb2JqZWN0LCBhbmQgd3JhcCBpdCBpblxuICogTWljcm9iZSBmb3IgY2hhaW5pbmcgcHVycG9zZS5cbiAqXG4gKiBAcmV0dXJuICBNaWNyb2JlXG4qL1xuTWljcm9iZS5wcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbiAoKVxue1xuICAgIGlmICggdGhpcy5sZW5ndGggPT09IDEgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBNaWNyb2JlKCAnJywgJycsIFsgdGhpc1sgMCBdIF0gKTtcbn07XG5cblxuLyoqXG4gKiBHZXQgUGFyZW50IEluZGV4XG4gKlxuICogZ2V0cyB0aGUgaW5kZXggb2YgdGhlIGl0ZW0gaW4gaXQncyBwYXJlbnROb2RlJ3MgY2hpbGRyZW4gYXJyYXlcbiAqXG4gKiBAcGFyYW0gIHtlbGVtZW50IG9iamVjdCBvciBhcnJheX0gX2VsIG9iamVjdCB0byBmaW5kIHRoZSBpbmRleCBvZiAob3B0aW9uYWwpXG4gKiBAcmV0dXJuIHthcnJheX0gICAgICAgICAgICAgICAgICAgICAgIGFycmF5IG9mIGluZGV4ZXNcbiAqL1xuTWljcm9iZS5wcm90b3R5cGUuZ2V0UGFyZW50SW5kZXggPSBmdW5jdGlvbiggX2VsIClcbntcbiAgICBsZXQgX2dldFBhcmVudEluZGV4ID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoIF9lbG0ucGFyZW50Tm9kZS5jaGlsZHJlbiwgX2VsbSApO1xuICAgIH07XG5cbiAgICBsZXQgaW5kZXhlcyA9IFtdO1xuXG4gICAgaWYgKCBfZWwgKVxuICAgIHtcbiAgICAgICAgaW5kZXhlcyA9IF9nZXRQYXJlbnRJbmRleCggX2VsICk7XG4gICAgICAgIHJldHVybiBpbmRleGVzO1xuICAgIH1cblxuICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBpbmRleGVzLnB1c2goIF9nZXRQYXJlbnRJbmRleCggdGhpc1sgaSBdICkgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5kZXhlcztcbn07XG5cblxuLyoqXG4gKiBBbHRlci9HZXQgaW5uZXIgSFRNTFxuICpcbiAqIENoYW5nZXMgdGhlIGlubmVySHRtbCB0byB0aGUgc3VwcGxpZWQgc3RyaW5nLlxuICogSWYgdGhlIHZhbHVlIGlzIG9taXR0ZWQsIHNpbXBseSByZXR1cm5zIHRoZSBjdXJyZW50IGlubmVyIGh0bWwgdmFsdWUgb2YgdGhlIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtICAgX3ZhbHVlICAgICAgc3RyaW5nICAgICAgICAgIGh0bWwgdmFsdWUgKG9wdGlvbmFsKVxuICogQHBhcmFtICAgX2VsICAgICAgICAgSFRNTEVMZW1lbnQgICAgIGVsZW1lbnQgdG8gbW9kaWZ5IChvcHRpb25hbClcbiAqXG4gKiBAcmV0dXJuICBtaXhlZCAoIE1pY3JvYmUgb3Igc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3MpXG4qL1xuTWljcm9iZS5wcm90b3R5cGUuaHRtbCA9IGZ1bmN0aW9uICggX3ZhbHVlLCBfZWwpXG57XG4gICAgbGV0IF9zZXRIdG1sID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgX2VsbS5pbm5lckhUTUwgPSBfdmFsdWU7XG4gICAgfTtcblxuICAgIGxldCBfZ2V0SHRtbCA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIHJldHVybiBfZWxtLmlubmVySFRNTDtcbiAgICB9O1xuXG4gICAgaWYgKCBfdmFsdWUgfHwgX3ZhbHVlID09PSAnJyApXG4gICAge1xuICAgICAgICBpZiAoIF9lbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9zZXRIdG1sKCBfZWwgKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3NldEh0bWwoIHRoaXNbIGkgXSApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbGV0IG1hcmt1cCA9IFtdO1xuICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBtYXJrdXAucHVzaCggX2dldEh0bWwoIHRoaXNbIGkgXSApICk7XG4gICAgfVxuXG4gICAgaWYgKCBtYXJrdXAubGVuZ3RoID09PSAxIClcbiAgICB7XG4gICAgICAgIHJldHVybiBtYXJrdXBbMF07XG4gICAgfVxuICAgIHJldHVybiBtYXJrdXA7XG59O1xuXG5cbi8qKlxuICogSW5zZXJ0IEFmdGVyXG4gKlxuICogSW5zZXJ0cyB0aGUgZ2l2ZW4gZWxlbWVudCBhZnRlciBlYWNoIG9mIHRoZSBlbGVtZW50cyBnaXZlbiAob3IgcGFzc2VkIHRocm91Z2ggdGhpcykuXG4gKiBpZiBpdCBpcyBhbiBlbGVtbmV0IGl0IGlzIHdyYXBwZWQgaW4gYSBtaWNyb2JlIG9iamVjdC4gIGlmIGl0IGlzIGEgc3RyaW5nIGl0IGlzIGNyZWF0ZWRcbiAqXG4gKiBAZXhhbXBsZSDCtSggJy5lbGVtZW50c0luRG9tJyApLmluc2VydEFmdGVyKCDCtUVsZW1lbnRUb0luc2VydCApXG4gKlxuICogQHBhcmFtICB7b2JqZWN0IG9yIHN0cmluZ30gX2VsQWZ0ZXIgZWxlbWVudCB0byBpbnNlcnRcbiAqIEBwYXJhbSAge29iamVjdH0gX2VsICAgICAgZWxlbWVudCB0byBpbnNlcnQgYWZ0ZXIgKG9wdGlvbmFsKVxuICpcbiAqIEByZXR1cm4gTWljcm9iZVxuICovXG5NaWNyb2JlLnByb3RvdHlwZS5pbnNlcnRBZnRlciA9IGZ1bmN0aW9uKCBfZWxBZnRlciwgX2VsIClcbntcbiAgICBsZXQgX2luc2VydEFmdGVyID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgX2VsQWZ0ZXIgPSB0aGlzLm1pY3JvLmFwcGx5KCB0aGlzLCBbIF9lbEFmdGVyIF0gKTtcbiAgICAgICAgX2VsbSAgICAgPSB0aGlzLm1pY3JvLmFwcGx5KCB0aGlzLCBbIF9lbG0gXSApO1xuXG4gICAgICAgIGxldCBuZXh0SW5kZXg7XG5cbiAgICAgICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSBfZWxtLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICAgICAge1xuICAgICAgICAgICAgbmV4dEluZGV4ID0gdGhpcy5nZXRQYXJlbnRJbmRleCggX2VsbVsgaSBdICk7XG5cbiAgICAgICAgICAgIGxldCBuZXh0RWxlICAgPSBfZWxtWyBpIF0ucGFyZW50Tm9kZS5jaGlsZHJlblsgbmV4dEluZGV4ICsgMSBdO1xuXG4gICAgICAgICAgICBpZiAoIG5leHRFbGUgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5leHRFbGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoIF9lbEFmdGVyWzBdLmNsb25lTm9kZSggdHJ1ZSApLCBuZXh0RWxlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2VsbVsgaSBdLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIF9lbEFmdGVyWzBdLmNsb25lTm9kZSggdHJ1ZSApICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCBfZWwgKVxuICAgIHtcbiAgICAgICAgX2luc2VydEFmdGVyLmFwcGx5KCB0aGlzLCBbIF9lbCBdICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBfaW5zZXJ0QWZ0ZXIuYXBwbHkoIHRoaXMsIFsgdGhpc1sgaSBdIF0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBHZXQgTGFzdCBFbGVtZW50XG4gKlxuICogTWV0aG9kcyBnZXRzIHRoZSBsYXN0IEhUTUwgRWxlbWVudHMgb2YgdGhlIGN1cnJlbnQgb2JqZWN0LCBhbmQgd3JhcCBpdCBpblxuICogTWljcm9iZSBmb3IgY2hhaW5pbmcgcHVycG9zZS5cbiAqXG4gKiBAcmV0dXJuICBNaWNyb2JlXG4gKi9cbk1pY3JvYmUucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAoKVxue1xuICAgIGlmICggdGhpcy5sZW5ndGggPT09IDEgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBNaWNyb2JlKCAnJywgJycsIFsgdGhpc1sgdGhpcy5sZW5ndGggLSAxIF0gXSApO1xufTtcblxuXG4vKipcbiAqIEdldCBQYXJlbnRcbiAqXG4gKiBzZXRzIGFsbCBlbGVtZW50cyBpbiDCtSB0byB0aGVpciBwYXJlbnQgbm9kZXNcbiAqXG4gKiBAcGFyYW0gIHtbdHlwZV19IF9lbCBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbk1pY3JvYmUucHJvdG90eXBlLnBhcmVudCA9IGZ1bmN0aW9uKCBfZWwgKVxue1xuICAgIGxldCBfcGFyZW50ID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIF9lbG0ucGFyZW50Tm9kZTtcbiAgICB9O1xuXG4gICAgbGV0IHBhcmVudEFycmF5ID0gW107XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgcGFyZW50QXJyYXkucHVzaCggX3BhcmVudCggdGhpc1sgaSBdICkgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE1pY3JvYmUoICcnLCAnJywgcGFyZW50QXJyYXkgKTtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgRWxlbWVudFxuICpcbiAqIHJlbW92ZXMgYW4gZWxlbWVudCBvciBlbGVtZW50cyBmcm9tIHRoZSBkb21cbiAqXG4gKiBAcGFyYW0gIHtbdHlwZV19IF9lbCBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbk1pY3JvYmUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCBfZWwgKVxue1xuICAgIGxldCBfcmVtb3ZlID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIF9lbG0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggX2VsbSApO1xuICAgIH07XG5cbiAgICBpZiAoIF9lbCApXG4gICAge1xuICAgICAgICBfcmVtb3ZlKCBfZWwgKTtcbiAgICB9XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgX3JlbW92ZSggdGhpc1sgaSBdICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogQWx0ZXIvR2V0IGlubmVyIFRleHRcbiAqXG4gKiBDaGFuZ2VzIHRoZSBpbm5lciB0ZXh0IHRvIHRoZSBzdXBwbGllZCBzdHJpbmcuXG4gKiBJZiB0aGUgdmFsdWUgaXNcbiAqIElmIHRoZSB2YWx1ZSBpcyBvbWl0dGVkLCBzaW1wbHkgcmV0dXJucyB0aGUgY3VycmVudCBpbm5lciBodG1sIHZhbHVlIG9mIHRoZSBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSAgIF92YWx1ZSAgICAgIHN0cmluZyAgICAgICAgICBUZXh0IHZhbHVlIChvcHRpb25hbClcbiAqIEBwYXJhbSAgIF9lbCAgICAgICAgIEhUTUxFTGVtZW50ICAgICBlbGVtZW50IHRvIG1vZGlmeSAob3B0aW9uYWwpXG4gKlxuICogQHJldHVybiAgbWl4ZWQgKCBNaWNyb2JlIG9yIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmdzKVxuKi9cbk1pY3JvYmUucHJvdG90eXBlLnRleHQgPSBmdW5jdGlvbiAoIF92YWx1ZSwgX2VsKVxue1xuICAgIGxldCBfc2V0VGV4dCA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIGlmKCBkb2N1bWVudC5hbGwgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfZWxtLmlubmVyVGV4dCA9IF92YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIC8vIHN0dXBpZCBGRlxuICAgICAgICB7XG4gICAgICAgICAgICBfZWxtLnRleHRDb250ZW50ID0gX3ZhbHVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGxldCBfZ2V0VGV4dCA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIGlmKCBkb2N1bWVudC5hbGwgKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gX2VsbS5pbm5lclRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSAvLyBzdHVwaWQgRkZcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIF9lbG0udGV4dENvbnRlbnQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCBfdmFsdWUgKVxuICAgIHtcbiAgICAgICAgaWYgKCBfZWwgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfc2V0VGV4dCggX2VsICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9zZXRUZXh0KCB0aGlzWyBpIF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxldCBhcnJheVRleHQgPSBbXTtcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgYXJyYXlUZXh0LnB1c2goIF9nZXRUZXh0KCB0aGlzWyBpIF0gKSApO1xuICAgIH1cblxuICAgIGlmICggYXJyYXlUZXh0Lmxlbmd0aCA9PT0gMSApXG4gICAge1xuICAgICAgICByZXR1cm4gYXJyYXlUZXh0WzBdO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXlUZXh0O1xufTtcblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKiBqc2hpbnQgZXNuZXh0OiB0cnVlKi9cbi8qKlxuICogbWljcm9iZS5jc3MuanNcbiAqXG4gKiBAYXV0aG9yICBNb3VzZSBCcmF1biAgICAgICAgIDxtb3VzZUBzb2Npb21hbnRpYy5jb20+XG4gKiBAYXV0aG9yICBOaWNvbGFzIEJydWduZWF1eCAgIDxuaWNvbGFzLmJydWduZWF1eEBzb2Npb21hbnRpYy5jb20+XG4gKlxuICogQHBhY2thZ2UgTWljcm9iZVxuICovXG5cbiAvKipcbiAqIEFkZCBDbGFzc1xuICpcbiAqIE1ldGhvZCBhZGRzIHRoZSBnaXZlbiBjbGFzcyBmcm9tIHRoZSBjdXJyZW50IG9iamVjdCBvciB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gICBfY2xhc3MgICAgICBzdHJpbmcgICAgICAgY2xhc3MgdG8gYWRkXG4gKiBAcGFyYW0gICBfZWwgICAgICAgICBIVE1MRUxlbWVudCAgZWxlbWVudCB0byBtb2RpZnkgKG9wdGlvbmFsKVxuICpcbiAqIEByZXR1cm4gIE1pY3JvYmVcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uKCBfY2xhc3MsIF9lbCApXG57XG4gICAgbGV0IF9hZGRDbGFzcyA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICB7XG4gICAgICAgIF9lbG0uY2xhc3NOYW1lICs9IF9lbG0uY2xhc3NOYW1lLmxlbmd0aCA+IDAgPyAnICcgKyBfY2xhc3MgOiBfY2xhc3M7XG4gICAgfTtcblxuICAgIGlmICggX2VsIClcbiAgICB7XG4gICAgICAgIF9hZGRDbGFzcyggX2VsICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBfYWRkQ2xhc3MoIHRoaXNbIGkgXSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEFsdGVyL0dldCBDU1NcbiAqXG4gKiBDaGFuZ2VzIHRoZSBDU1MgYnkgd3JpdGluZyB0aGUgZ2l2ZW4gcHJvcGVydHkgYW5kIHZhbHVlIGlubGluZSB0byB0aGVcbiAqIHN1cHBsaWVkIGVsZW1lbnRzLiAocHJvcGVydGllcyBzaG91bGQgYmUgc3VwcGxpZWQgaW4gamF2YXNjcmlwdCBmb3JtYXQpLlxuICogSWYgdGhlIHZhbHVlIGlzIG9taXR0ZWQsIHNpbXBseSByZXR1cm5zIHRoZSBjdXJyZW50IGNzcyB2YWx1ZSBvZiB0aGUgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gICBfcHJvcGVydHkgICBzdHJpbmcgICAgICAgICAgSlMgZm9ybWF0dGVkIENTUyBwcm9wZXJ0eVxuICogQHBhcmFtICAgX2VsICAgICAgICAgSFRNTEVMZW1lbnQgICAgIGVsZW1lbnQgdG8gbW9kaWZ5IChvcHRpb25hbClcbiAqIEBwYXJhbSAgIF92YWx1ZSAgICAgIHN0cmluZyAgICAgICAgICBDU1MgdmFsdWUgKG9wdGlvbmFsKVxuICpcbiAqIEByZXR1cm4gIG1peGVkICggTWljcm9iZSBvciBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncylcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5jc3MgPSBmdW5jdGlvbiAoIF9wcm9wZXJ0eSwgX3ZhbHVlLCBfZWwpXG57XG4gICAgbGV0IF9zZXRDc3MgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICBpZiAoIF92YWx1ZSA9PT0gbnVsbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9lbG0uc3R5bGUucmVtb3ZlUHJvcGVydHkoIF9wcm9wZXJ0eSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgX2VsbS5zdHlsZVsgX3Byb3BlcnR5IF0gPSBfdmFsdWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IF9nZXRDc3MgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIF9lbG0gKS5nZXRQcm9wZXJ0eVZhbHVlKCBfcHJvcGVydHkgKTtcbiAgICB9O1xuXG4gICAgaWYgKCBfdmFsdWUgIT09IHVuZGVmaW5lZCApXG4gICAge1xuICAgICAgICBpZiAoIF9lbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9zZXRDc3MoIF9lbCApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfc2V0Q3NzKCB0aGlzWyBpIF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxldCBzdHlsZXMgPSBbXTtcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgc3R5bGVzLnB1c2goIF9nZXRDc3MoIHRoaXNbIGkgXSApICk7XG4gICAgfVxuICAgIGlmICggc3R5bGVzLmxlbmd0aCA9PT0gMSApXG4gICAge1xuICAgICAgICByZXR1cm4gc3R5bGVzWzBdO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXM7XG59O1xuXG5cbi8qKlxuICogSGFzIENsYXNzXG4gKlxuICogTWV0aG9kIGNoZWNrcyBpZiB0aGUgY3VycmVudCBvYmplY3Qgb3IgdGhlIGdpdmVuIGVsZW1lbnQgaGFzIHRoZSBnaXZlbiBjbGFzc1xuICpcbiAqIEBwYXJhbSAgIF9jbGFzcyAgICAgIHN0cmluZyAgICAgICBjbGFzcyB0byBjaGVja1xuICogQHBhcmFtICAgX2VsICAgICAgICAgSFRNTEVMZW1lbnQgIGVsZW1lbnQgdG8gbW9kaWZ5IChvcHRpb25hbClcbiAqXG4gKiBAcmV0dXJuICBNaWNyb2JlXG4qL1xuTWljcm9iZS5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiggX2NsYXNzLCBfZWwgKVxue1xuICAgIGxldCBjbGFzc1JlZ2V4ID0gbmV3IFJlZ0V4cCggJyhefFxcXFxzKScgKyBfY2xhc3MgKyAnKFxcXFxzfCQpJywgJ2cnICk7XG5cbiAgICBsZXQgX2hhc0NsYXNzID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgcmV0dXJuICEhX2VsbS5jbGFzc05hbWUubWF0Y2goIGNsYXNzUmVnZXggKTtcbiAgICB9O1xuXG4gICAgaWYgKCBfZWwgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIF9oYXNDbGFzcyggX2VsICk7XG4gICAgfVxuXG4gICAgbGV0IGksIGxlbiwgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoIGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICB7XG4gICAgICAgIHJlc3VsdHMucHVzaCggX2hhc0NsYXNzKCB0aGlzWyBpIF0gKSApO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xufTtcblxuXG4vKipcbiAqIFJlbW92ZSBDbGFzc1xuICpcbiAqIE1ldGhvZCByZW1vdmVzIHRoZSBnaXZlbiBjbGFzcyBmcm9tIHRoZSBjdXJyZW50IG9iamVjdCBvciB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gICBfY2xhc3MgICAgICBzdHJpbmcgICAgICAgY2xhc3MgdG8gcmVtb3ZlXG4gKiBAcGFyYW0gICBfZWwgICAgICAgICBIVE1MRUxlbWVudCAgZWxlbWVudCB0byBtb2RpZnkgKG9wdGlvbmFsKVxuICpcbiAqIEByZXR1cm4gIE1pY3JvYmVcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKCBfY2xhc3MsIF9lbCApXG57XG4gICAgbGV0IGNsYXNzUmVnZXggPSBuZXcgUmVnRXhwKCAnKD86XnwgKyknICsgX2NsYXNzICsgJyAqKD89ICt8JCknLCAnZycgKTtcblxuICAgIGxldCBfcmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICBfZWxtLmNsYXNzTmFtZSA9IF9lbG0uY2xhc3NOYW1lLnJlcGxhY2UoIGNsYXNzUmVnZXggLCAnJyApLnRyaW0oKTtcbiAgICAgICAgaWYgKCBfZWxtLmNsYXNzTGlzdC5sZW5ndGggPT09IDAgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfZWxtLnJlbW92ZUF0dHJpYnV0ZSggJ2NsYXNzJyApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGlmICggX2VsIClcbiAgICB7XG4gICAgICAgIF9yZW1vdmVDbGFzcyggX2VsICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBfcmVtb3ZlQ2xhc3MoIHRoaXNbIGkgXSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFRvZ2dsZSBDbGFzc1xuICpcbiAqIE1ldGhvZHMgY2FsbHMgcmVtb3ZlQ2xhc3Mgb3IgcmVtb3ZlQ2xhc3MgZnJvbSB0aGUgY3VycmVudCBvYmplY3Qgb3IgZ2l2ZW5cbiAqIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtICAgX2NsYXNzICAgICAgc3RyaW5nICAgICAgIGNsYXNzIHRvIGFkZFxuICogQHBhcmFtICAgX2VsICAgICAgICAgSFRNTEVMZW1lbnQgIGVsZW1lbnQgdG8gbW9kaWZ5IChvcHRpb25hbClcbiAqXG4gKiBAcmV0dXJuICBNaWNyb2JlXG4qL1xuTWljcm9iZS5wcm90b3R5cGUudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbiAoIF9jbGFzcywgX2VsIClcbntcbiAgICBsZXQgX3RvZ2dsZUNsYXNzID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgaWYgKCBfZWxtLmNsYXNzTmFtZS5pbmRleE9mKCBfY2xhc3MgKSA+IC0xIClcbiAgICAgICAge1xuICAgICAgICAgICAgTWljcm9iZS5yZW1vdmVDbGFzcyggX2NsYXNzLCBfZWxtICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBNaWNyb2JlLmFkZENsYXNzKCBfY2xhc3MsIF9lbG0gKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIF9lbCApXG4gICAge1xuICAgICAgICBfdG9nZ2xlQ2xhc3MoIF9lbCApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgX3RvZ2dsZUNsYXNzKCB0aGlzWyBpIF0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoganNoaW50IGVzbmV4dDogdHJ1ZSovXG4vKipcbiAqIG1pY3JvYmUuZXZlbnRzLmpzXG4gKlxuICogQGF1dGhvciAgTW91c2UgQnJhdW4gICAgICAgICA8bW91c2VAc29jaW9tYW50aWMuY29tPlxuICogQGF1dGhvciAgTmljb2xhcyBCcnVnbmVhdXggICA8bmljb2xhcy5icnVnbmVhdXhAc29jaW9tYW50aWMuY29tPlxuICpcbiAqIEBwYWNrYWdlIE1pY3JvYmVcbiAqL1xuXG4gLyoqXG4gKiBCaW5kIEV2ZW50c1xuICpcbiAqIE1ldGhvZHMgYmluZHMgYW4gZXZlbnQgdG8gdGhlIEhUTUxFbGVtZW50cyBvZiB0aGUgY3VycmVudCBvYmplY3Qgb3IgdG8gdGhlXG4gKiBnaXZlbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSAgIF9ldmVudCAgICAgIHN0cmluZyAgICAgICAgICBIVE1MRXZlbnRcbiAqIEBwYXJhbSAgIF9jYWxsYmFjayAgIGZ1bmN0aW9uICAgICAgICBjYWxsYmFjayBmdW5jdGlvblxuICogQHBhcmFtICAgX2VsICAgICAgICAgSFRNTEVMZW1lbnQgICAgIGVsZW1lbnQgdG8gbW9kaWZ5IChvcHRpb25hbClcbiAqXG4gKiBAcmV0dXJuICBNaWNyb2JlXG4qL1xuTWljcm9iZS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uICggX2V2ZW50LCBfY2FsbGJhY2ssIF9lbCApXG57XG4gICAgbGV0IF9iaW5kID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgaWYgKCAhX2VsbS5hZGRFdmVudExpc3RlbmVyIClcbiAgICAgICAge1xuICAgICAgICAgICAgX2VsbS5hdHRhY2hFdmVudCggX2V2ZW50LCBfY2FsbGJhY2sgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9lbG0uYWRkRXZlbnRMaXN0ZW5lciggX2V2ZW50LCBfY2FsbGJhY2sgKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIF9lbCApXG4gICAge1xuICAgICAgICBfYmluZCggX2VsICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBfYmluZCggdGhpc1sgaSBdICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cblxuIC8qKlxuICogVW5iaW5kIEV2ZW50c1xuICpcbiAqIE1ldGhvZHMgdW5iaW5kcyBhbiBldmVudCBmcm9tIHRoZSBIVE1MRWxlbWVudHMgb2YgdGhlIGN1cnJlbnQgb2JqZWN0IG9yIHRvIHRoZVxuICogZ2l2ZW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gICBfZXZlbnQgICAgICBzdHJpbmcgICAgICAgICAgSFRNTEV2ZW50XG4gKiBAcGFyYW0gICBfY2FsbGJhY2sgICBmdW5jdGlvbiAgICAgICAgY2FsbGJhY2sgZnVuY3Rpb25cbiAqIEBwYXJhbSAgIF9lbCAgICAgICAgIEhUTUxFTGVtZW50ICAgICBlbGVtZW50IHRvIG1vZGlmeSAob3B0aW9uYWwpXG4gKlxuICogQHJldHVybiAgTWljcm9iZVxuKi9cbk1pY3JvYmUucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uICggX2V2ZW50LCBfY2FsbGJhY2ssIF9lbCApXG57XG4gICAgbGV0IF91bmJpbmQgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICBfZWxtLnJlbW92ZUV2ZW50TGlzdGVuZXIoIF9ldmVudCwgX2NhbGxiYWNrICk7XG4gICAgfTtcblxuICAgIGlmICggX2VsIClcbiAgICB7XG4gICAgICAgIF91bmJpbmQoIF9lbCApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgX3VuYmluZCggdGhpc1sgaSBdICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qXG4gKiBSZWFkeVxuICpcbiAqIE1ldGhvZHMgZGV0ZWN0cyBpZiB0aGUgRE9NIGlzIHJlYWR5LlxuICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTIwNzAwNVxuICpcbiAqIEByZXR1cm4gIHZvaWRcbiovXG5NaWNyb2JlLnByb3RvdHlwZS5yZWFkeSA9IGZ1bmN0aW9uKCBfY2FsbGJhY2sgKVxue1xuICAgIC8qIE1vemlsbGEsIENocm9tZSwgT3BlcmEgKi9cbiAgICBpZiAoIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgKVxuICAgIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBfY2FsbGJhY2ssIGZhbHNlICk7XG4gICAgfVxuICAgIC8qIFNhZmFyaSwgaUNhYiwgS29ucXVlcm9yICovXG4gICAgaWYgKCAvS0hUTUx8V2ViS2l0fGlDYWIvaS50ZXN0KCBuYXZpZ2F0b3IudXNlckFnZW50ICkgKVxuICAgIHtcbiAgICAgICAgbGV0IERPTUxvYWRUaW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggL2xvYWRlZHxjb21wbGV0ZS9pLnRlc3QoIGRvY3VtZW50LnJlYWR5U3RhdGUgKSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2NhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCggRE9NTG9hZFRpbWVyICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwKTtcbiAgICB9XG4gICAgLyogT3RoZXIgd2ViIGJyb3dzZXJzICovXG4gICAgd2luZG93Lm9ubG9hZCA9IF9jYWxsYmFjaztcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoganNoaW50IGVzbmV4dDogdHJ1ZSovXG4vKipcbiAqIG1pY3JvYmUuaHR0cC5qc1xuICpcbiAqIEBhdXRob3IgIE1vdXNlIEJyYXVuICAgICAgICAgPG1vdXNlQHNvY2lvbWFudGljLmNvbT5cbiAqIEBhdXRob3IgIE5pY29sYXMgQnJ1Z25lYXV4ICAgPG5pY29sYXMuYnJ1Z25lYXV4QHNvY2lvbWFudGljLmNvbT5cbiAqXG4gKiBAcGFja2FnZSBNaWNyb2JlXG4gKi9cblxuXG5NaWNyb2JlLnByb3RvdHlwZS5odHRwID0gZnVuY3Rpb24oIF9wYXJhbWV0ZXJzIClcbntcbiAgICByZXR1cm4gbmV3IFByb21pc2UoIGZ1bmN0aW9uKCByZXNvbHZlLCByZWplY3QgKVxuICAgIHtcbiAgICAgICAgaWYgKCAhX3BhcmFtZXRlcnMgKSB7IHJlamVjdCggRXJyb3IoICdObyBwYXJhbWV0ZXJzIGdpdmVuJyApICk7IH1cbiAgICAgICAgaWYgKCB0eXBlb2YgX3BhcmFtZXRlcnMgPT09ICdzdHJpbmcnIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3BhcmFtZXRlcnMgPSB7IHVybDogX3BhcmFtZXRlcnMgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXEgICAgICAgICA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICBsZXQgbWV0aG9kICAgICAgPSBfcGFyYW1ldGVycy5tZXRob2QgfHwgJ0dFVCc7XG4gICAgICAgIGxldCB1cmwgICAgICAgICA9IF9wYXJhbWV0ZXJzLnVybDtcbiAgICAgICAgbGV0IGRhdGEgICAgICAgID0gSlNPTi5zdHJpbmdpZnkoIF9wYXJhbWV0ZXJzLmRhdGEgKSB8fCBudWxsO1xuICAgICAgICBsZXQgdXNlciAgICAgICAgPSBfcGFyYW1ldGVycy51c2VyIHx8ICcnO1xuICAgICAgICBsZXQgcGFzc3dvcmQgICAgPSBfcGFyYW1ldGVycy5wYXNzd29yZCB8fCAnJztcbiAgICAgICAgbGV0IGhlYWRlcnMgICAgID0gX3BhcmFtZXRlcnMuaGVhZGVycyAgfHwgbnVsbDtcblxuICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIHJlcS5yZWFkeVN0YXRlID09PSA0IClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXEub25lcnJvciA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmVqZWN0KCBFcnJvciggJ05ldHdvcmsgZXJyb3IhJyApICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVxLm9wZW4oIG1ldGhvZCwgdXJsLCB0cnVlLCB1c2VyLCBwYXNzd29yZCApO1xuXG4gICAgICAgIGlmICggaGVhZGVycyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggQXJyYXkuaXNBcnJheSggaGVhZGVycyApIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IGhlYWRlcnMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoIGhlYWRlcnNbaV0uaGVhZGVyLCBoZWFkZXJzW2ldLnZhbHVlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCBoZWFkZXJzLmhlYWRlciwgaGVhZGVycy52YWx1ZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVxLnNlbmQoIGRhdGEgKTtcbiAgICAgICAgcmVxLm9ubG9hZCA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCByZXEuc3RhdHVzID09PSAyMDAgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHJlcS5yZXNwb25zZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlamVjdCggRXJyb3IoIHJlcS5zdGF0dXMgKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xufTtcblxuTWljcm9iZS5wcm90b3R5cGUuaHR0cC5nZXQgPSBmdW5jdGlvbiggX3VybCApXG57XG4gICAgcmV0dXJuIHRoaXMoe1xuICAgICAgICB1cmwgICAgIDogX3VybCxcbiAgICAgICAgbWV0aG9kICA6ICdHRVQnXG4gICAgfSk7XG59O1xuXG5NaWNyb2JlLnByb3RvdHlwZS5odHRwLnBvc3QgPSBmdW5jdGlvbiggX3VybCwgX2RhdGEgKVxue1xuICAgIHJldHVybiB0aGlzKHtcbiAgICAgICAgdXJsICAgICA6IF91cmwsXG4gICAgICAgIGRhdGEgICAgOiBfZGF0YSxcbiAgICAgICAgbWV0aG9kICA6ICdQT1NUJ1xuICAgIH0pO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKiBqc2hpbnQgZXNuZXh0OiB0cnVlKi9cbi8qKlxuICogbWljcm9iZS5tYWluLmpzXG4gKlxuICogQGF1dGhvciAgTW91c2UgQnJhdW4gICAgICAgICA8bW91c2VAc29jaW9tYW50aWMuY29tPlxuICogQGF1dGhvciAgTmljb2xhcyBCcnVnbmVhdXggICA8bmljb2xhcy5icnVnbmVhdXhAc29jaW9tYW50aWMuY29tPlxuICpcbiAqIEBwYWNrYWdlIE1pY3JvYmVcbiAqL1xuXG4gLyoqXG4gKiDCtSBjb25zdHJ1Y3RvclxuICpcbiAqIGJ1aWxkcyB0aGUgwrUgb2JqZWN0XG4gKlxuICogQHJldHVybiDCtVxuICovXG5sZXQgwrUgPSAoZnVuY3Rpb24oKVxue1xuICAgIGxldCBpbm5lciA9IGZ1bmN0aW9uKCBzZWxlY3Rvciwgc2NvcGUgKVxuICAgIHtcbiAgICAgICAgbGV0IG1pY3JvYmVJbm5lciA9IG5ldyBNaWNyb2JlKCBzZWxlY3Rvciwgc2NvcGUgKTtcblxuICAgICAgICByZXR1cm4gbWljcm9iZUlubmVyO1xuICAgIH07XG5cbiAgICBmb3IoIGxldCBwcm9wIGluIE1pY3JvYmUucHJvdG90eXBlIClcbiAgICB7XG4gICAgICAgIGlmICggTWljcm9iZS5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoIHByb3AgKSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlubmVyWyBwcm9wIF0gPSBNaWNyb2JlLnByb3RvdHlwZVsgcHJvcCBdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGlubmVyO1xufSgpKTtcblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuIiwiJHRyYWNldXJSdW50aW1lLnNldFByb3BlcnR5KCRfX3BsYWNlaG9sZGVyX18wLFxuICAgICAgICAgICRfX3BsYWNlaG9sZGVyX18xLCAkX19wbGFjZWhvbGRlcl9fMikiLCIkX19wbGFjZWhvbGRlcl9fMFskdHJhY2V1clJ1bnRpbWUudG9Qcm9wZXJ0eSgkX19wbGFjZWhvbGRlcl9fMSldIiwidmFyICRfX3BsYWNlaG9sZGVyX18wID0gJF9fcGxhY2Vob2xkZXJfXzEiLCIoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKSgkX19wbGFjZWhvbGRlcl9fMCwgJF9fcGxhY2Vob2xkZXJfXzEsICRfX3BsYWNlaG9sZGVyX18yKSIsIlxuICAgICAgICBmb3IgKHZhciAkX19wbGFjZWhvbGRlcl9fMCA9XG4gICAgICAgICAgICAgICAgICRfX3BsYWNlaG9sZGVyX18xW1N5bWJvbC5pdGVyYXRvcl0oKSxcbiAgICAgICAgICAgICAgICAgJF9fcGxhY2Vob2xkZXJfXzI7XG4gICAgICAgICAgICAgISgkX19wbGFjZWhvbGRlcl9fMyA9ICRfX3BsYWNlaG9sZGVyX180Lm5leHQoKSkuZG9uZTsgKSB7XG4gICAgICAgICAgJF9fcGxhY2Vob2xkZXJfXzU7XG4gICAgICAgICAgJF9fcGxhY2Vob2xkZXJfXzY7XG4gICAgICAgIH0iLCIkdHJhY2V1clJ1bnRpbWUuaW5pdEdlbmVyYXRvckZ1bmN0aW9uKCRfX3BsYWNlaG9sZGVyX18wKSIsInZhciAkYXJndW1lbnRzID0gYXJndW1lbnRzOyIsInJldHVybiAkX19wbGFjZWhvbGRlcl9fMChcbiAgICAgICAgICAgICAgJF9fcGxhY2Vob2xkZXJfXzEsXG4gICAgICAgICAgICAgICRfX3BsYWNlaG9sZGVyX18yLCB0aGlzKTsiLCIkdHJhY2V1clJ1bnRpbWUuY3JlYXRlR2VuZXJhdG9ySW5zdGFuY2UiLCJmdW5jdGlvbigkY3R4KSB7XG4gICAgICB3aGlsZSAodHJ1ZSkgJF9fcGxhY2Vob2xkZXJfXzBcbiAgICB9IiwiJGN0eC5zdGF0ZSA9ICgkX19wbGFjZWhvbGRlcl9fMCkgPyAkX19wbGFjZWhvbGRlcl9fMSA6ICRfX3BsYWNlaG9sZGVyX18yO1xuICAgICAgICBicmVhayIsInJldHVybiAkX19wbGFjZWhvbGRlcl9fMCIsIiRjdHgubWF5YmVUaHJvdygpIiwicmV0dXJuICRjdHguZW5kKCkiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=