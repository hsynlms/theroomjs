/*!
* theroomjs v2.0.0
* A vanilla javascript plugin that allows you to outline dom elements like web inspectors.
* Works with Chrome, Firefox, Safari, Internet Explorer and Edge
*
* Author: Huseyin Elmas
*/
(function(window, document) {
  // defaults
  var namespace = 'theRoom';
  var options = {};
  var defaults = {
    inspector: null,
    htmlClass: true,
    blockRedirection: false,
    excludes: [
      'meta',
      'link',
      'style',
      'script'
    ]
    /*
    events:
      - started
      - starting
      - stopped
      - stopping
      - click
      - mouseover
      - hook
    */
  };

  // get the inspector instance
  var getInspector = function() {
    // validation
    if (typeof options.inspector === 'string') {
      // if the provided inspector is a css selector, return the element
      var el = document.querySelector(options.inspector);
      if (el) return el;
    }

    if (options.inspector instanceof Element) {
      // if the provided inspector is a dom element, return it
      return el;
    }

    // validation failed
    throw 'inspector not found.\nit can be a css selector or a DOM element';
  };

  // get the query to make the elements be inspected
  var getExclusionSelector = function() {
    return options.excludes.join(',');
  };

  // merge options
  var applyOptions = function(opts) {
    // validation
    if (!opts) return;
    if (typeof opts !== 'object') {
      throw 'options is expected to be an object';
    }

    // change old values with new ones
    for (var opt in opts) {
      if (opts.hasOwnProperty(opt)) {
        options[opt] = opts[opt];
      }
    }
  };

  // event emitter
  var eventEmitter = function(event) {
    // hook event invocation
    eventController('hook', event);

    // get target element
    var target = event.target;

    // validation
    // skip itself
    if (!target || target === options.inspector) return;

    // do not inspect excluded elements
    var query = getExclusionSelector();
    var excludedElements = Array.prototype.slice.call(document.querySelectorAll(query));
    if (excludedElements.indexOf(target) >= 0) return;

    if (event.type === 'mouseover') {
      // get target element information
      var pos = target.getBoundingClientRect();
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      var width = pos.width;
      var height = pos.height;
      var top = Math.max(0, pos.top + scrollTop);
      var left = Math.max(0, pos.left + scrollLeft);

      // set inspector element position and dimension
      options.inspector.style.top = top + 'px';
      options.inspector.style.left = left + 'px';
      options.inspector.style.width = width + 'px';
      options.inspector.style.height = height + 'px';
    }

    // event invocation
    eventController(event.type, target);
  };

  // inspection engine
  var inspectionEngine = function(type) {
    // get HTML element class names
    var htmlClasses = document.querySelector('html').className;

    if (type === 'start') {
      // block redirection to another page
      if (options.blockRedirection === true) {
        window.onbeforeunload = function() {
          return true;
        };
      }

      // bind event listeners
      document.addEventListener('click', eventEmitter);
      document.addEventListener('mouseover', eventEmitter);

      if (options.htmlClass === true) {
        htmlClasses = htmlClasses + ' ' + namespace;
      }

      window[namespace].status = 'running';
    } else if (type === 'stop') {
      // unbind event listeners
      document.removeEventListener('click', eventEmitter);
      document.removeEventListener('mouseover', eventEmitter);

      if (options.htmlClass === true) {
        htmlClasses = htmlClasses.replace(' ' + namespace, '');
      }

      // unblock redirection to another page
      if (options.blockRedirection === true) {
        window.onbeforeunload = undefined;
      }

      window[namespace].status = 'stopped';
    }
  };

  // event executor
  var eventController = function(type, arg) {
    // validation
    if (!options[type]) return;
    if (typeof options[type] !== 'function') {
      throw 'event handler must be a function: ' + type;
    }

    // call the event
    switch(type) {
      case 'started':
      case 'starting':
      case 'stopped':
      case 'stopping':
      case 'click':
      case 'mouseover':
      case 'hook':
        // pass the argument
        options[type].call(null, arg);
        break;
    }
  };

  // start inspection
  var start = function(opts) {
    // merge provided options with defaults
    applyOptions(defaults);
    applyOptions(opts);

    // get the inspector element
    options.inspector = getInspector();

    // starting event call
    eventController('starting');

    // start the inspection engine
    inspectionEngine('start');

    // started event call
    eventController('started');
  };

  // stop inspection
  var stop = function() {
    // stopping event call
    eventController('stopping');

    // stop the inspection engine
    inspectionEngine('stop');

    // stopped event call
    eventController('stopped');

    // reset options
    options = {};
  };

  // dynamically event binder
  var eventBinder = function(type, handler) {
    // validation
    if (!type) {
      throw 'event name is is not valid';
    }

    if (typeof type !== 'string') {
      throw 'event name is expected to be a string but got: ' + typeof type;
    }

    if (typeof handler !== 'function') {
      throw 'event handler is not a function for: ' + type;
    }

    // update options
    options[type] = handler;
  };

  // make it accessible from outside
  window[namespace] = {
    start: start,
    stop: stop,
    on: eventBinder,
    status: defaults.status
  };
})(window, document);
