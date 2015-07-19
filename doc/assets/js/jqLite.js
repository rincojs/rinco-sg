
;(function(window, document){

  'use strict';

  /**
   * @description
   *
   * This object provides a utility for producing rich Error messages within
   * Angular. It can be called as follows:
   *
   * var exampleMinErr = minErr('example');
   * throw exampleMinErr('one', 'This {0} is {1}', foo, bar);
   *
   * The above creates an instance of minErr in the example namespace. The
   * resulting error will have a namespaced error code of example.one.  The
   * resulting error will replace {0} with the value of foo, and {1} with the
   * value of bar. The object is not restricted in the number of arguments it can
   * take.
   *
   * If fewer arguments are specified than necessary for interpolation, the extra
   * interpolation markers will be preserved in the final string.
   *
   * Since data will be parsed statically during a build step, some restrictions
   * are applied with respect to how minErr instances are created and called.
   * Instances should have names of the form namespaceMinErr for a minErr created
   * using minErr('namespace') . Error codes, namespaces and template strings
   * should all be static strings, not variables or general expressions.
   *
   * @param {string} module The namespace to use for the new minErr instance.
   * @param {function} ErrorConstructor Custom error constructor to be instantiated when returning
   *   error from returned function, for cases when a particular type of error is useful.
   * @returns {function(code:string, template:string, ...templateArgs): Error} minErr instance
   */

  function minErr(module, ErrorConstructor) {
    ErrorConstructor = ErrorConstructor || Error;
    return function() {
      var SKIP_INDEXES = 2;

      var templateArgs = arguments,
        code = templateArgs[0],
        message = '[' + (module ? module + ':' : '') + code + '] ',
        template = templateArgs[1],
        paramPrefix, i;

      message += template.replace(/\{\d+\}/g, function(match) {
        var index = +match.slice(1, -1),
          shiftedIndex = index + SKIP_INDEXES;

        if (shiftedIndex < templateArgs.length) {
          return toDebugString(templateArgs[shiftedIndex]);
        }

        return match;
      });

      message += '\nhttp://errors.angularjs.org/"NG_VERSION_FULL"/' +
        (module ? module + '/' : '') + code;

      for (i = SKIP_INDEXES, paramPrefix = '?'; i < templateArgs.length; i++, paramPrefix = '&') {
        message += paramPrefix + 'p' + (i - SKIP_INDEXES) + '=' +
          encodeURIComponent(toDebugString(templateArgs[i]));
      }

      return new ErrorConstructor(message);
    };
  }

  var
      msie,             // holds major version number for IE, or NaN if UA is not IE.
      slice             = [].slice,
      splice            = [].splice,
      push              = [].push,
      toString          = Object.prototype.toString,
      getPrototypeOf    = Object.getPrototypeOf,
      ngMinErr          = minErr('ng'),
      uid               = 0;

  /**
   * documentMode is an IE-only property
   * http://msdn.microsoft.com/en-us/library/ie/cc196988(v=vs.85).aspx
   */
  msie = document.documentMode;
  var NODE_TYPE_ELEMENT = 1;
  var NODE_TYPE_ATTRIBUTE = 2;
  var NODE_TYPE_TEXT = 3;
  var NODE_TYPE_COMMENT = 8;
  var NODE_TYPE_DOCUMENT = 9;
  var NODE_TYPE_DOCUMENT_FRAGMENT = 11;

  function concat(array1, array2, index) {
      return array1.concat(slice.call(array2, index));
  }

  /**
   * @ngdoc function
   * @name angular.isString
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `String`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `String`.
   */

  function isString(value) {
      return typeof value === 'string';
  }



  /**
   * @ngdoc function
   * @name angular.forEach
   * @module ng
   * @kind function
   *
   * @description
   * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
   * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
   * is the value of an object property or an array element, `key` is the object property key or
   * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
   *
   * It is worth noting that `.forEach` does not iterate over inherited properties because it filters
   * using the `hasOwnProperty` method.
   *
   * Unlike ES262's
   * [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),
   * Providing 'undefined' or 'null' values for `obj` will not throw a TypeError, but rather just
   * return the value provided.
   *
     ```js
       var values = {name: 'misko', gender: 'male'};
       var log = [];
       angular.forEach(values, function(value, key) {
         this.push(key + ': ' + value);
       }, log);
       expect(log).toEqual(['name: misko', 'gender: male']);
     ```
   *
   * @param {Object|Array} obj Object to iterate over.
   * @param {Function} iterator Iterator function.
   * @param {Object=} context Object to become context (`this`) for the iterator function.
   * @returns {Object|Array} Reference to `obj`.
   */

  function forEach(obj, iterator, context) {
      var key, length;
      if (obj) {
          if (isFunction(obj)) {
              for (key in obj) {
                  // Need to check if hasOwnProperty exists,
                  // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
                  if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
                      iterator.call(context, obj[key], key, obj);
                  }
              }
          } else if (isArray(obj) || isArrayLike(obj)) {
              var isPrimitive = typeof obj !== 'object';
              for (key = 0, length = obj.length; key < length; key++) {
                  if (isPrimitive || key in obj) {
                      iterator.call(context, obj[key], key, obj);
                  }
              }
          } else if (obj.forEach && obj.forEach !== forEach) {
              obj.forEach(iterator, context, obj);
          } else if (isBlankObject(obj)) {
              // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
              for (key in obj) {
                  iterator.call(context, obj[key], key, obj);
              }
          } else if (typeof obj.hasOwnProperty === 'function') {
              // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
              for (key in obj) {
                  if (obj.hasOwnProperty(key)) {
                      iterator.call(context, obj[key], key, obj);
                  }
              }
          } else {
              // Slow path for objects which do not have a method `hasOwnProperty`
              for (key in obj) {
                  if (hasOwnProperty.call(obj, key)) {
                      iterator.call(context, obj[key], key, obj);
                  }
              }
          }
      }
      return obj;
  }

  /**
   * @ngdoc function
   * @name angular.isUndefined
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is undefined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is undefined.
   */

  function isUndefined(value) {
      return typeof value === 'undefined';
  }


  /**
   * @ngdoc function
   * @name angular.isDefined
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is defined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is defined.
   */

  function isDefined(value) {
      return typeof value !== 'undefined';
  }
  var trim = function(value) {
      return isString(value) ? value.trim() : value;
  };

  /**
   * @ngdoc function
   * @name angular.isObject
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
   * considered to be objects. Note that JavaScript arrays are objects.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Object` but not `null`.
   */

  function isObject(value) {
      // http://jsperf.com/isobject4
      return value !== null && typeof value === 'object';
  }

  /**
   * @ngdoc function
   * @name angular.lowercase
   * @module ng
   * @kind function
   *
   * @description Converts the specified string to lowercase.
   * @param {string} string String to be converted to lowercase.
   * @returns {string} Lowercased string.
   */
  var lowercase = function(string) {return isString(string) ? string.toLowerCase() : string;};
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  /**
   * @ngdoc function
   * @name angular.uppercase
   * @module ng
   * @kind function
   *
   * @description Converts the specified string to uppercase.
   * @param {string} string String to be converted to uppercase.
   * @returns {string} Uppercased string.
   */
  var uppercase = function(string) {return isString(string) ? string.toUpperCase() : string;};


  var manualLowercase = function(s) {
    /* jshint bitwise: false */
    return isString(s)
        ? s.replace(/[A-Z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) | 32);})
        : s;
  };
  var manualUppercase = function(s) {
    /* jshint bitwise: false */
    return isString(s)
        ? s.replace(/[a-z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) & ~32);})
        : s;
  };


  // String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
  // locale, for this reason we need to detect this case and redefine lowercase/uppercase methods
  // with correct but slower alternatives.
  if ('i' !== 'I'.toLowerCase()) {
    lowercase = manualLowercase;
    uppercase = manualUppercase;
  }

  /**
   * @ngdoc function
   * @name angular.isFunction
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `Function`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Function`.
   */
  function isFunction(value) {return typeof value === 'function';}

  /**
   * @ngdoc function
   * @name angular.isArray
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is an `Array`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Array`.
   */
  var isArray = Array.isArray;

  /**
   * @private
   * @param {*} obj
   * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
   *                   String ...)
   */
  function isArrayLike(obj) {
    if (obj == null || isWindow(obj)) {
      return false;
    }

    // Support: iOS 8.2 (not reproducible in simulator)
    // "length" in obj used to prevent JIT error (gh-11508)
    var length = "length" in Object(obj) && obj.length;

    if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
      return true;
    }

    return isString(obj) || isArray(obj) || length === 0 ||
           typeof length === 'number' && length > 0 && (length - 1) in obj;
  }


  /**
   * Determine if a value is an object with a null prototype
   *
   * @returns {boolean} True if `value` is an `Object` with a null prototype
   */
  function isBlankObject(value) {
    return value !== null && typeof value === 'object' && !getPrototypeOf(value);
  }

  /**
   * Checks if `obj` is a window object.
   *
   * @private
   * @param {*} obj Object to check
   * @returns {boolean} True if `obj` is a window obj.
   */
  function isWindow(obj) {
    return obj && obj.window === obj;
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *     Any commits to this file should be reviewed with security in mind.  *
   *   Changes to this file can potentially create security vulnerabilities. *
   *          An approval from 2 Core members with history of modifying      *
   *                         this file is required.                          *
   *                                                                         *
   *  Does the change somehow allow for arbitrary javascript to be executed? *
   *    Or allows for someone to change the prototype of built-in objects?   *
   *     Or gives undesired access to variables likes document or window?    *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  /* global JQLitePrototype: true,
    addEventListenerFn: true,
    removeEventListenerFn: true,
    BOOLEAN_ATTR: true,
    ALIASED_ATTR: true,
  */

  //////////////////////////////////
  //JQLite
  //////////////////////////////////

  /**
   * @ngdoc function
   * @name angular.element
   * @module ng
   * @kind function
   *
   * @description
   * Wraps a raw DOM element or HTML string as a [jQuery](http://jquery.com) element.
   *
   * If jQuery is available, `angular.element` is an alias for the
   * [jQuery](http://api.jquery.com/jQuery/) function. If jQuery is not available, `angular.element`
   * delegates to Angular's built-in subset of jQuery, called "jQuery lite" or "jqLite."
   *
   * <div class="alert alert-success">jqLite is a tiny, API-compatible subset of jQuery that allows
   * Angular to manipulate the DOM in a cross-browser compatible way. **jqLite** implements only the most
   * commonly needed functionality with the goal of having a very small footprint.</div>
   *
   * To use `jQuery`, simply ensure it is loaded before the `angular.js` file.
   *
   * <div class="alert">**Note:** all element references in Angular are always wrapped with jQuery or
   * jqLite; they are never raw DOM references.</div>
   *
   * ## Angular's jqLite
   * jqLite provides only the following jQuery methods:
   *
   * - [`addClass()`](http://api.jquery.com/addClass/)
   * - [`after()`](http://api.jquery.com/after/)
   * - [`append()`](http://api.jquery.com/append/)
   * - [`attr()`](http://api.jquery.com/attr/) - Does not support functions as parameters
   * - [`bind()`](http://api.jquery.com/bind/) - Does not support namespaces, selectors or eventData
   * - [`children()`](http://api.jquery.com/children/) - Does not support selectors
   * - [`clone()`](http://api.jquery.com/clone/)
   * - [`contents()`](http://api.jquery.com/contents/)
   * - [`css()`](http://api.jquery.com/css/) - Only retrieves inline-styles, does not call `getComputedStyle()`. As a setter, does not convert numbers to strings or append 'px'.
   * - [`data()`](http://api.jquery.com/data/)
   * - [`detach()`](http://api.jquery.com/detach/)
   * - [`empty()`](http://api.jquery.com/empty/)
   * - [`eq()`](http://api.jquery.com/eq/)
   * - [`find()`](http://api.jquery.com/find/) - Limited to lookups by tag name
   * - [`hasClass()`](http://api.jquery.com/hasClass/)
   * - [`html()`](http://api.jquery.com/html/)
   * - [`next()`](http://api.jquery.com/next/) - Does not support selectors
   * - [`on()`](http://api.jquery.com/on/) - Does not support namespaces, selectors or eventData
   * - [`off()`](http://api.jquery.com/off/) - Does not support namespaces or selectors
   * - [`one()`](http://api.jquery.com/one/) - Does not support namespaces or selectors
   * - [`parent()`](http://api.jquery.com/parent/) - Does not support selectors
   * - [`prepend()`](http://api.jquery.com/prepend/)
   * - [`prop()`](http://api.jquery.com/prop/)
   * - [`ready()`](http://api.jquery.com/ready/)
   * - [`remove()`](http://api.jquery.com/remove/)
   * - [`removeAttr()`](http://api.jquery.com/removeAttr/)
   * - [`removeClass()`](http://api.jquery.com/removeClass/)
   * - [`removeData()`](http://api.jquery.com/removeData/)
   * - [`replaceWith()`](http://api.jquery.com/replaceWith/)
   * - [`text()`](http://api.jquery.com/text/)
   * - [`toggleClass()`](http://api.jquery.com/toggleClass/)
   * - [`triggerHandler()`](http://api.jquery.com/triggerHandler/) - Passes a dummy event object to handlers.
   * - [`unbind()`](http://api.jquery.com/unbind/) - Does not support namespaces
   * - [`val()`](http://api.jquery.com/val/)
   * - [`wrap()`](http://api.jquery.com/wrap/)
   *
   * ## jQuery/jqLite Extras
   * Angular also provides the following additional methods and events to both jQuery and jqLite:
   *
   * ### Events
   * - `$destroy` - AngularJS intercepts all jqLite/jQuery's DOM destruction apis and fires this event
   *    on all DOM nodes being removed.  This can be used to clean up any 3rd party bindings to the DOM
   *    element before it is removed.
   *
   * ### Methods
   * - `controller(name)` - retrieves the controller of the current element or its parent. By default
   *   retrieves controller associated with the `ngController` directive. If `name` is provided as
   *   camelCase directive name, then the controller for this directive will be retrieved (e.g.
   *   `'ngModel'`).
   * - `injector()` - retrieves the injector of the current element or its parent.
   * - `scope()` - retrieves the {@link ng.$rootScope.Scope scope} of the current
   *   element or its parent. Requires {@link guide/production#disabling-debug-data Debug Data} to
   *   be enabled.
   * - `isolateScope()` - retrieves an isolate {@link ng.$rootScope.Scope scope} if one is attached directly to the
   *   current element. This getter should be used only on elements that contain a directive which starts a new isolate
   *   scope. Calling `scope()` on this element always returns the original non-isolate scope.
   *   Requires {@link guide/production#disabling-debug-data Debug Data} to be enabled.
   * - `inheritedData()` - same as `data()`, but walks up the DOM until a value is found or the top
   *   parent element is reached.
   *
   * @param {string|DOMElement} element HTML string or DOMElement to be wrapped into jQuery.
   * @returns {Object} jQuery object.
   */

  JQLite.expando = 'ng339';

  var jqCache = JQLite.cache = {},
      jqId = 1,
      addEventListenerFn = function(element, type, fn) {
        element.addEventListener(type, fn, false);
      },
      removeEventListenerFn = function(element, type, fn) {
        element.removeEventListener(type, fn, false);
      };

  /*
   * !!! This is an undocumented "private" function !!!
   */
  JQLite._data = function(node) {
    //jQuery always returns an object on cache miss
    return this.cache[node[this.expando]] || {};
  };

  function jqNextId() { return ++jqId; }


  var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  var MOZ_HACK_REGEXP = /^moz([A-Z])/;
  var MOUSE_EVENT_MAP= { mouseleave: "mouseout", mouseenter: "mouseover"};
  var jqLiteMinErr = minErr('jqLite');

  /**
   * Converts snake_case to camelCase.
   * Also there is special case for Moz prefix starting with upper case letter.
   * @param name Name to normalize
   */
  function camelCase(name) {
    return name.
      replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      }).
      replace(MOZ_HACK_REGEXP, 'Moz$1');
  }

  var SINGLE_TAG_REGEXP = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  var HTML_REGEXP = /<|&#?\w+;/;
  var TAG_NAME_REGEXP = /<([\w:]+)/;
  var XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;

  var wrapMap = {
    'option': [1, '<select multiple="multiple">', '</select>'],

    'thead': [1, '<table>', '</table>'],
    'col': [2, '<table><colgroup>', '</colgroup></table>'],
    'tr': [2, '<table><tbody>', '</tbody></table>'],
    'td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    '_default': [0, "", ""]
  };

  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;


  function jqLiteIsTextNode(html) {
    return !HTML_REGEXP.test(html);
  }

  function jqLiteAcceptsData(node) {
    // The window object can accept data but has no nodeType
    // Otherwise we are only interested in elements (1) and documents (9)
    var nodeType = node.nodeType;
    return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT;
  }

  function jqLiteHasData(node) {
    for (var key in jqCache[node.ng339]) {
      return true;
    }
    return false;
  }

  function jqLiteBuildFragment(html, context) {
    var tmp, tag, wrap,
        fragment = context.createDocumentFragment(),
        nodes = [], i;

    if (jqLiteIsTextNode(html)) {
      // Convert non-html into a text node
      nodes.push(context.createTextNode(html));
    } else {
      // Convert html into DOM nodes
      tmp = tmp || fragment.appendChild(context.createElement("div"));
      tag = (TAG_NAME_REGEXP.exec(html) || ["", ""])[1].toLowerCase();
      wrap = wrapMap[tag] || wrapMap._default;
      tmp.innerHTML = wrap[1] + html.replace(XHTML_TAG_REGEXP, "<$1></$2>") + wrap[2];

      // Descend through wrappers to the right content
      i = wrap[0];
      while (i--) {
        tmp = tmp.lastChild;
      }

      nodes = concat(nodes, tmp.childNodes);

      tmp = fragment.firstChild;
      tmp.textContent = "";
    }

    // Remove wrapper from fragment
    fragment.textContent = "";
    fragment.innerHTML = ""; // Clear inner HTML
    forEach(nodes, function(node) {
      fragment.appendChild(node);
    });

    return fragment;
  }

  function jqLiteParseHTML(html, context) {
    context = context || document;
    var parsed;

    if ((parsed = SINGLE_TAG_REGEXP.exec(html))) {
      return [context.createElement(parsed[1])];
    }

    if ((parsed = jqLiteBuildFragment(html, context))) {
      return parsed.childNodes;
    }

    return [];
  }

  /////////////////////////////////////////////
  function JQLite(element) {
    if (element instanceof JQLite) {
      return element;
    }

    var argIsString;

    if (isString(element)) {
      element = trim(element);
      argIsString = true;
    }
    if (!(this instanceof JQLite)) {
      if (argIsString && element.charAt(0) != '<') {
        // throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
        return new JQLite(document.querySelectorAll(element));
      }
      return new JQLite(element);
    }

    if (argIsString) {
      jqLiteAddNodes(this, jqLiteParseHTML(element));
    } else {
      jqLiteAddNodes(this, element);
    }
  }

  function jqLiteClone(element) {
    return element.cloneNode(true);
  }

  function jqLiteDealoc(element, onlyDescendants) {
    if (!onlyDescendants) jqLiteRemoveData(element);

    if (element.querySelectorAll) {
      var descendants = element.querySelectorAll('*');
      for (var i = 0, l = descendants.length; i < l; i++) {
        jqLiteRemoveData(descendants[i]);
      }
    }
  }

  function jqLiteOff(element, type, fn, unsupported) {
    if (isDefined(unsupported)) throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');

    var expandoStore = jqLiteExpandoStore(element);
    var events = expandoStore && expandoStore.events;
    var handle = expandoStore && expandoStore.handle;

    if (!handle) return; //no listeners registered

    if (!type) {
      for (type in events) {
        if (type !== '$destroy') {
          removeEventListenerFn(element, type, handle);
        }
        delete events[type];
      }
    } else {
      forEach(type.split(' '), function(type) {
        if (isDefined(fn)) {
          var listenerFns = events[type];
          arrayRemove(listenerFns || [], fn);
          if (listenerFns && listenerFns.length > 0) {
            return;
          }
        }

        removeEventListenerFn(element, type, handle);
        delete events[type];
      });
    }
  }

  function jqLiteRemoveData(element, name) {
    var expandoId = element.ng339;
    var expandoStore = expandoId && jqCache[expandoId];

    if (expandoStore) {
      if (name) {
        delete expandoStore.data[name];
        return;
      }

      if (expandoStore.handle) {
        if (expandoStore.events.$destroy) {
          expandoStore.handle({}, '$destroy');
        }
        jqLiteOff(element);
      }
      delete jqCache[expandoId];
      element.ng339 = undefined; // don't delete DOM expandos. IE and Chrome don't like it
    }
  }


  function jqLiteExpandoStore(element, createIfNecessary) {
    var expandoId = element.ng339,
        expandoStore = expandoId && jqCache[expandoId];

    if (createIfNecessary && !expandoStore) {
      element.ng339 = expandoId = jqNextId();
      expandoStore = jqCache[expandoId] = {events: {}, data: {}, handle: undefined};
    }

    return expandoStore;
  }


  function jqLiteData(element, key, value) {
    if (jqLiteAcceptsData(element)) {

      var isSimpleSetter = isDefined(value);
      var isSimpleGetter = !isSimpleSetter && key && !isObject(key);
      var massGetter = !key;
      var expandoStore = jqLiteExpandoStore(element, !isSimpleGetter);
      var data = expandoStore && expandoStore.data;

      if (isSimpleSetter) { // data('key', value)
        data[key] = value;
      } else {
        if (massGetter) {  // data()
          return data;
        } else {
          if (isSimpleGetter) { // data('key')
            // don't force creation of expandoStore if it doesn't exist yet
            return data && data[key];
          } else { // mass-setter: data({key1: val1, key2: val2})
            extend(data, key);
          }
        }
      }
    }
  }

  function jqLiteHasClass(element, selector) {
    if (!element.getAttribute) return false;
    return ((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").
        indexOf(" " + selector + " ") > -1);
  }

  function jqLiteRemoveClass(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      forEach(cssClasses.split(' '), function(cssClass) {
        element.setAttribute('class', trim(
            (" " + (element.getAttribute('class') || '') + " ")
            .replace(/[\n\t]/g, " ")
            .replace(" " + trim(cssClass) + " ", " "))
        );
      });
    }
  }

  function jqLiteAddClass(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ')
                              .replace(/[\n\t]/g, " ");

      forEach(cssClasses.split(' '), function(cssClass) {
        cssClass = trim(cssClass);
        if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
          existingClasses += cssClass + ' ';
        }
      });

      element.setAttribute('class', trim(existingClasses));
    }
  }


  function jqLiteAddNodes(root, elements) {
    // THIS CODE IS VERY HOT. Don't make changes without benchmarking.

    if (elements) {

      // if a Node (the most common case)
      if (elements.nodeType) {
        root[root.length++] = elements;
      } else {
        var length = elements.length;

        // if an Array or NodeList and not a Window
        if (typeof length === 'number' && elements.window !== elements) {
          if (length) {
            for (var i = 0; i < length; i++) {
              root[root.length++] = elements[i];
            }
          }
        } else {
          root[root.length++] = elements;
        }
      }
    }
  }


  function jqLiteController(element, name) {
    return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
  }

  function jqLiteInheritedData(element, name, value) {
    // if element is the document object work with the html element instead
    // this makes $(document).scope() possible
    if (element.nodeType == NODE_TYPE_DOCUMENT) {
      element = element.documentElement;
    }
    var names = isArray(name) ? name : [name];

    while (element) {
      for (var i = 0, ii = names.length; i < ii; i++) {
        if ((value = jqLite.data(element, names[i])) !== undefined) return value;
      }

      // If dealing with a document fragment node with a host element, and no parent, use the host
      // element as the parent. This enables directives within a Shadow DOM or polyfilled Shadow DOM
      // to lookup parent controllers.
      element = element.parentNode || (element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host);
    }
  }

  function jqLiteEmpty(element) {
    jqLiteDealoc(element, true);
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function jqLiteRemove(element, keepData) {
    if (!keepData) jqLiteDealoc(element);
    var parent = element.parentNode;
    if (parent) parent.removeChild(element);
  }


  function jqLiteDocumentLoaded(action, win) {
    win = win || window;
    if (win.document.readyState === 'complete') {
      // Force the action to be run async for consistent behaviour
      // from the action's point of view
      // i.e. it will definitely not be in a $apply
      win.setTimeout(action);
    } else {
      // No need to unbind this handler as load is only ever called once
      jqLite(win).on('load', action);
    }
  }

  //////////////////////////////////////////
  // Functions which are declared directly.
  //////////////////////////////////////////
  var JQLitePrototype = JQLite.prototype = {
    ready: function(fn) {
      var fired = false;

      function trigger() {
        if (fired) return;
        fired = true;
        fn();
      }

      // check if document is already loaded
      if (document.readyState === 'complete') {
        setTimeout(trigger);
      } else {
        this.on('DOMContentLoaded', trigger); // works for modern browsers and IE9
        // we can not use jqLite since we are not done loading and jQuery could be loaded later.
        // jshint -W064
        JQLite(window).on('load', trigger); // fallback to window.onload for others
        // jshint +W064
      }
    },
    toString: function() {
      var value = [];
      forEach(this, function(e) { value.push('' + e);});
      return '[' + value.join(', ') + ']';
    },

    eq: function(index) {
        return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
    },

    length: 0,
    push: push,
    sort: [].sort,
    splice: [].splice
  };

  //////////////////////////////////////////
  // Functions iterating getter/setters.
  // these functions return self on setter and
  // value on get.
  //////////////////////////////////////////
  var BOOLEAN_ATTR = {};
  forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function(value) {
    BOOLEAN_ATTR[lowercase(value)] = value;
  });
  var BOOLEAN_ELEMENTS = {};
  forEach('input,select,option,textarea,button,form,details'.split(','), function(value) {
    BOOLEAN_ELEMENTS[value] = true;
  });
  var ALIASED_ATTR = {
    'ngMinlength': 'minlength',
    'ngMaxlength': 'maxlength',
    'ngMin': 'min',
    'ngMax': 'max',
    'ngPattern': 'pattern'
  };

  function getBooleanAttrName(element, name) {
    // check dom last since we will most likely fail on name
    var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];

    // booleanAttr is here twice to minimize DOM access
    return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr;
  }

  function getAliasedAttrName(element, name) {
    var nodeName = element.nodeName;
    return (nodeName === 'INPUT' || nodeName === 'TEXTAREA') && ALIASED_ATTR[name];
  }

  forEach({
    data: jqLiteData,
    removeData: jqLiteRemoveData,
    hasData: jqLiteHasData
  }, function(fn, name) {
    JQLite[name] = fn;
  });

  forEach({
    data: jqLiteData,
    inheritedData: jqLiteInheritedData,

    scope: function(element) {
      // Can't use jqLiteData here directly so we stay compatible with jQuery!
      return jqLite.data(element, '$scope') || jqLiteInheritedData(element.parentNode || element, ['$isolateScope', '$scope']);
    },

    isolateScope: function(element) {
      // Can't use jqLiteData here directly so we stay compatible with jQuery!
      return jqLite.data(element, '$isolateScope') || jqLite.data(element, '$isolateScopeNoTemplate');
    },

    controller: jqLiteController,

    injector: function(element) {
      return jqLiteInheritedData(element, '$injector');
    },

    removeAttr: function(element, name) {
      element.removeAttribute(name);
    },

    hasClass: jqLiteHasClass,

    css: function(element, name, value) {
      name = camelCase(name);

      if (isDefined(value)) {
        element.style[name] = value;
      } else {
        return element.style[name];
      }
    },

    attr: function(element, name, value) {
      var nodeType = element.nodeType;
      if (nodeType === NODE_TYPE_TEXT || nodeType === NODE_TYPE_ATTRIBUTE || nodeType === NODE_TYPE_COMMENT) {
        return;
      }
      var lowercasedName = lowercase(name);
      if (BOOLEAN_ATTR[lowercasedName]) {
        if (isDefined(value)) {
          if (!!value) {
            element[name] = true;
            element.setAttribute(name, lowercasedName);
          } else {
            element[name] = false;
            element.removeAttribute(lowercasedName);
          }
        } else {
          return (element[name] ||
                   (element.attributes.getNamedItem(name) || noop).specified)
                 ? lowercasedName
                 : undefined;
        }
      } else if (isDefined(value)) {
        element.setAttribute(name, value);
      } else if (element.getAttribute) {
        // the extra argument "2" is to get the right thing for a.href in IE, see jQuery code
        // some elements (e.g. Document) don't have get attribute, so return undefined
        var ret = element.getAttribute(name, 2);
        // normalize non-existing attributes to undefined (as jQuery)
        return ret === null ? undefined : ret;
      }
    },

    prop: function(element, name, value) {
      if (isDefined(value)) {
        element[name] = value;
      } else {
        return element[name];
      }
    },

    text: (function() {
      getText.$dv = '';
      return getText;

      function getText(element, value) {
        if (isUndefined(value)) {
          var nodeType = element.nodeType;
          return (nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT) ? element.textContent : '';
        }
        element.textContent = value;
      }
    })(),

    val: function(element, value) {
      if (isUndefined(value)) {
        if (element.multiple && nodeName_(element) === 'select') {
          var result = [];
          forEach(element.options, function(option) {
            if (option.selected) {
              result.push(option.value || option.text);
            }
          });
          return result.length === 0 ? null : result;
        }
        return element.value;
      }
      element.value = value;
    },

    html: function(element, value) {
      if (isUndefined(value)) {
        return element.innerHTML;
      }
      jqLiteDealoc(element, true);
      element.innerHTML = value;
    },

    empty: jqLiteEmpty
  }, function(fn, name) {
    /**
     * Properties: writes return selection, reads return first value
     */
    JQLite.prototype[name] = function(arg1, arg2) {
      var i, key;
      var nodeCount = this.length;

      // jqLiteHasClass has only two arguments, but is a getter-only fn, so we need to special-case it
      // in a way that survives minification.
      // jqLiteEmpty takes no arguments but is a setter.
      if (fn !== jqLiteEmpty &&
          (((fn.length == 2 && (fn !== jqLiteHasClass && fn !== jqLiteController)) ? arg1 : arg2) === undefined)) {
        if (isObject(arg1)) {

          // we are a write, but the object properties are the key/values
          for (i = 0; i < nodeCount; i++) {
            if (fn === jqLiteData) {
              // data() takes the whole object in jQuery
              fn(this[i], arg1);
            } else {
              for (key in arg1) {
                fn(this[i], key, arg1[key]);
              }
            }
          }
          // return self for chaining
          return this;
        } else {
          // we are a read, so read the first child.
          // TODO: do we still need this?
          var value = fn.$dv;
          // Only if we have $dv do we iterate over all, otherwise it is just the first element.
          var jj = (value === undefined) ? Math.min(nodeCount, 1) : nodeCount;
          for (var j = 0; j < jj; j++) {
            var nodeValue = fn(this[j], arg1, arg2);
            value = value ? value + nodeValue : nodeValue;
          }
          return value;
        }
      } else {
        // we are a write, so apply to all children
        for (i = 0; i < nodeCount; i++) {
          fn(this[i], arg1, arg2);
        }
        // return self for chaining
        return this;
      }
    };
  });

  function createEventHandler(element, events) {
    var eventHandler = function(event, type) {
      // jQuery specific api
      event.isDefaultPrevented = function() {
        return event.defaultPrevented;
      };

      var eventFns = events[type || event.type];
      var eventFnsLength = eventFns ? eventFns.length : 0;

      if (!eventFnsLength) return;

      if (isUndefined(event.immediatePropagationStopped)) {
        var originalStopImmediatePropagation = event.stopImmediatePropagation;
        event.stopImmediatePropagation = function() {
          event.immediatePropagationStopped = true;

          if (event.stopPropagation) {
            event.stopPropagation();
          }

          if (originalStopImmediatePropagation) {
            originalStopImmediatePropagation.call(event);
          }
        };
      }

      event.isImmediatePropagationStopped = function() {
        return event.immediatePropagationStopped === true;
      };

      // Copy event handlers in case event handlers array is modified during execution.
      if ((eventFnsLength > 1)) {
        eventFns = shallowCopy(eventFns);
      }

      for (var i = 0; i < eventFnsLength; i++) {
        if (!event.isImmediatePropagationStopped()) {
          eventFns[i].call(element, event);
        }
      }
    };

    // TODO: this is a hack for angularMocks/clearDataCache that makes it possible to deregister all
    //       events on `element`
    eventHandler.elem = element;
    return eventHandler;
  }

  //////////////////////////////////////////
  // Functions iterating traversal.
  // These functions chain results into a single
  // selector.
  //////////////////////////////////////////
  forEach({
    removeData: jqLiteRemoveData,

    on: function jqLiteOn(element, type, fn, unsupported) {
      if (isDefined(unsupported)) throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');

      // Do not add event handlers to non-elements because they will not be cleaned up.
      if (!jqLiteAcceptsData(element)) {
        return;
      }

      var expandoStore = jqLiteExpandoStore(element, true);
      var events = expandoStore.events;
      var handle = expandoStore.handle;

      if (!handle) {
        handle = expandoStore.handle = createEventHandler(element, events);
      }

      // http://jsperf.com/string-indexof-vs-split
      var types = type.indexOf(' ') >= 0 ? type.split(' ') : [type];
      var i = types.length;

      while (i--) {
        type = types[i];
        var eventFns = events[type];

        if (!eventFns) {
          events[type] = [];

          if (type === 'mouseenter' || type === 'mouseleave') {
            // Refer to jQuery's implementation of mouseenter & mouseleave
            // Read about mouseenter and mouseleave:
            // http://www.quirksmode.org/js/events_mouse.html#link8

            jqLiteOn(element, MOUSE_EVENT_MAP[type], function(event) {
              var target = this, related = event.relatedTarget;
              // For mousenter/leave call the handler if related is outside the target.
              // NB: No relatedTarget if the mouse left/entered the browser window
              if (!related || (related !== target && !target.contains(related))) {
                handle(event, type);
              }
            });

          } else {
            if (type !== '$destroy') {
              addEventListenerFn(element, type, handle);
            }
          }
          eventFns = events[type];
        }
        eventFns.push(fn);
      }
    },

    off: jqLiteOff,

    one: function(element, type, fn) {
      element = jqLite(element);

      //add the listener twice so that when it is called
      //you can remove the original function and still be
      //able to call element.off(ev, fn) normally
      element.on(type, function onFn() {
        element.off(type, fn);
        element.off(type, onFn);
      });
      element.on(type, fn);
    },

    replaceWith: function(element, replaceNode) {
      var index, parent = element.parentNode;
      jqLiteDealoc(element);
      forEach(new JQLite(replaceNode), function(node) {
        if (index) {
          parent.insertBefore(node, index.nextSibling);
        } else {
          parent.replaceChild(node, element);
        }
        index = node;
      });
    },

    children: function(element) {
      var children = [];
      forEach(element.childNodes, function(element) {
        if (element.nodeType === NODE_TYPE_ELEMENT) {
          children.push(element);
        }
      });
      return children;
    },

    contents: function(element) {
      return element.contentDocument || element.childNodes || [];
    },

    append: function(element, node) {
      var nodeType = element.nodeType;
      if (nodeType !== NODE_TYPE_ELEMENT && nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT) return;

      node = new JQLite(node);

      for (var i = 0, ii = node.length; i < ii; i++) {
        var child = node[i];
        element.appendChild(child);
      }
    },

    prepend: function(element, node) {
      if (element.nodeType === NODE_TYPE_ELEMENT) {
        var index = element.firstChild;
        forEach(new JQLite(node), function(child) {
          element.insertBefore(child, index);
        });
      }
    },

    wrap: function(element, wrapNode) {
      wrapNode = jqLite(wrapNode).eq(0).clone()[0];
      var parent = element.parentNode;
      if (parent) {
        parent.replaceChild(wrapNode, element);
      }
      wrapNode.appendChild(element);
    },

    remove: jqLiteRemove,

    detach: function(element) {
      jqLiteRemove(element, true);
    },

    after: function(element, newElement) {
      var index = element, parent = element.parentNode;
      newElement = new JQLite(newElement);

      for (var i = 0, ii = newElement.length; i < ii; i++) {
        var node = newElement[i];
        parent.insertBefore(node, index.nextSibling);
        index = node;
      }
    },

    addClass: jqLiteAddClass,
    removeClass: jqLiteRemoveClass,

    toggleClass: function(element, selector, condition) {
      if (selector) {
        forEach(selector.split(' '), function(className) {
          var classCondition = condition;
          if (isUndefined(classCondition)) {
            classCondition = !jqLiteHasClass(element, className);
          }
          (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
        });
      }
    },

    parent: function(element) {
      var parent = element.parentNode;
      return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
    },

    next: function(element) {
      return element.nextElementSibling;
    },

    find: function(element, selector) {
      if (element.getElementsByTagName) {
        return element.getElementsByTagName(selector);
      } else {
        return [];
      }
    },

    clone: jqLiteClone,

    triggerHandler: function(element, event, extraParameters) {

      var dummyEvent, eventFnsCopy, handlerArgs;
      var eventName = event.type || event;
      var expandoStore = jqLiteExpandoStore(element);
      var events = expandoStore && expandoStore.events;
      var eventFns = events && events[eventName];

      if (eventFns) {
        // Create a dummy event to pass to the handlers
        dummyEvent = {
          preventDefault: function() { this.defaultPrevented = true; },
          isDefaultPrevented: function() { return this.defaultPrevented === true; },
          stopImmediatePropagation: function() { this.immediatePropagationStopped = true; },
          isImmediatePropagationStopped: function() { return this.immediatePropagationStopped === true; },
          stopPropagation: noop,
          type: eventName,
          target: element
        };

        // If a custom event was provided then extend our dummy event with it
        if (event.type) {
          dummyEvent = extend(dummyEvent, event);
        }

        // Copy event handlers in case event handlers array is modified during execution.
        eventFnsCopy = shallowCopy(eventFns);
        handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent];

        forEach(eventFnsCopy, function(fn) {
          if (!dummyEvent.isImmediatePropagationStopped()) {
            fn.apply(element, handlerArgs);
          }
        });
      }
    }
  }, function(fn, name) {
    /**
     * chaining functions
     */
    JQLite.prototype[name] = function(arg1, arg2, arg3) {
      var value;

      for (var i = 0, ii = this.length; i < ii; i++) {
        if (isUndefined(value)) {
          value = fn(this[i], arg1, arg2, arg3);
          if (isDefined(value)) {
            // any function which returns a value needs to be wrapped
            value = jqLite(value);
          }
        } else {
          jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
        }
      }
      return isDefined(value) ? value : this;
    };

    // bind legacy bind/unbind to on/off
    JQLite.prototype.bind = JQLite.prototype.on;
    JQLite.prototype.unbind = JQLite.prototype.off;
    window.$ = JQLite;
  });
}(window, document));
