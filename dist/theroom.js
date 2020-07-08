/*!
* theroomjs v2.0.0
* A vanilla javascript plugin that allows you to outline dom elements like web inspectors.
* Works with Chrome, Firefox, Safari, Internet Explorer and Edge
*
* Author: Huseyin ELMAS
*/
(function (window, document, namespace) {
  var status = 'idle'

  // default options
  var options = {
    inspector: null,
    htmlClass: true,
    blockRedirection: false,
    excludes: []
  }

  // gets the inspector instance
  var getInspector = function () {
    // validation
    if (typeof options.inspector === 'string') {
      // if the provided inspector is a css selector, return the element
      var el = document.querySelector(options.inspector)

      if (el) return el
      else throw Error('inspector element not found')
    }

    // validation
    if (options.inspector instanceof Element) {
      // if the provided inspector is a dom element, return it
      return el
    }

    // validation failed
    throw Error('inspector must be a css selector or a DOM element')
  }

  // gets the css selector for excluded list
  var getExclusionSelector = function () {
    return options.excludes.join(',')
  }

  // merge options with defaults
  var applyOptions = function (opts) {
    // validation
    if (typeof opts !== 'object') throw Error('options is expected to be an object')

    // merge
    for (var opt in opts) {
      if (opts.hasOwnProperty(opt)) {
        options[opt] = opts[opt]
      }
    }
  }

  // event emitter
  var eventEmitter = function (event) {
    // hook event invocation
    eventController('hook', event)

    // get target element
    var target = event.target

    // validation --also skip inspector itself--
    if (!target || target === options.inspector) return

    // do not inspect excluded elements
    var excludedSelector = getExclusionSelector()
    var excludedElements = Array.prototype.slice.call(document.querySelectorAll(excludedSelector))
    if (excludedElements.indexOf(target) >= 0) return

    if (event.type === 'mouseover') {
      // get target element information
      var pos = target.getBoundingClientRect()
      var scrollTop = window.scrollY || document.documentElement.scrollTop
      var scrollLeft = window.scrollX || document.documentElement.scrollLeft
      var width = pos.width
      var height = pos.height
      var top = Math.max(0, pos.top + scrollTop)
      var left = Math.max(0, pos.left + scrollLeft)

      // set inspector element position and dimension
      options.inspector.style.top = top + 'px'
      options.inspector.style.left = left + 'px'
      options.inspector.style.width = width + 'px'
      options.inspector.style.height = height + 'px'
    }

    // event invocation
    eventController(event.type, target)
  }

  // inspection engine
  var engine = function (type) {
    // get HTML element
    var htmlEl = document.querySelector('html')

    if (type === 'start') {
      // block redirection to another page
      if (options.blockRedirection === true) {
        window.onbeforeunload = function () {
          return true
        }
      }

      // bind event listeners
      document.addEventListener('click', eventEmitter)
      document.addEventListener('mouseover', eventEmitter)

      // add namespace as class to HTML element
      if (options.htmlClass === true) htmlEl.className += ' ' + namespace

      status = 'running'
    } else if (type === 'stop') {
      // unbind event listeners
      document.removeEventListener('click', eventEmitter)
      document.removeEventListener('mouseover', eventEmitter)

      // remove namespace from HTML element class list
      if (options.htmlClass === true) htmlEl.className = htmlEl.className.replace(' ' + namespace, '')

      // unblock redirection to another page
      if (options.blockRedirection === true) window.onbeforeunload = undefined

      status = 'stopped'
    }
  }

  // event executor
  var eventController = function (type, arg) {
    // validations
    if (!options[type]) return
    if (typeof options[type] !== 'function') throw Error('event handler must be a function: ' + type)

    // call the event
    switch (type) {
      case 'starting':
      case 'started':
      case 'stopping':
      case 'stopped':
      case 'click':
      case 'mouseover':
      case 'hook':
        // pass the argument
        options[type].call(null, arg)
        break
    }
  }

  // start inspection
  var start = function (opts) {
    // merge provided options with defaults
    applyOptions(opts)

    // get the inspector element
    options.inspector = getInspector()

    // starting event
    eventController('starting')

    // start the inspection engine
    engine('start')

    // started event
    eventController('started')
  }

  // stop inspection
  var stop = function () {
    // stopping event
    eventController('stopping')

    // stop the inspection engine
    engine('stop')

    // stopped event
    eventController('stopped')
  }

  // dynamically event binder
  var eventBinder = function (name, handler) {
    // validations
    if (typeof name !== 'string') throw Error('event name is expected to be a string but got: ' + typeof name)
    if (typeof handler !== 'function') throw Error('event handler is not a function for: ' + name)

    // update options
    options[name] = handler
  }

  // make it accessible from outside
  window[namespace] = {
    start: start,
    stop: stop,
    on: eventBinder,
    status: function () {
      return status
    }
  }
})(window, document, 'theRoom')
