/*
* TheRoom JS v1.0.1
* A vanilla javascript plugin that allows you to outline dom elements like web inspectors.
* Works with Chrome, Firefox, Safari, Internet Explorer and Edge
*
* Author:
* Huseyin Elmas <hsynlms47@gmail.com>
*/
(function(window, document) {
  // define the plugin in global variable to make it accessible from outside
  window.theRoom = (function(window, document) {
    // default options
    var options = {
      inspector: null,
      namespace: "theroom",
      bgcolor: "rgba(255,0,0,0.5)",
      transitionSpeed: 200,
      useInline: true,
      onStart: null,
      onStarting: null,
      onStop: null,
      onStopping: null,
      onClick: null,
      exceptions: [
        "head",
        "meta",
        "link",
        "style",
        "title",
        "script"
      ]
    };

    // some snippet functions
    var utils = (function() {
      var objectToCss = function(obj) {
        var css = "";
        
        if (typeof obj === "object" && obj) {
          css += "{";

          for (var key in obj) {
            if (obj.hasOwnProperty(key) && obj[key]) {
              css += key + ": " + obj[key] + ";";
            }
          }

          css += "}";
        }

        return css;
      };

      return {
        objectToCss: objectToCss
      };
    })();

    // retrieve active inspector instance
    var getInspector = function() {
      // check if there is an existing inspector
      // if not create one
      if (!options.inspector) {
        options.inspector = createInspector();
      }

      // return the inspector
      return options.inspector;
    };

    // prepare inspector element css styles
    var prepareInspectorStyles = function(top, left, width, height) {
      // prepare inspector element styles
      var _styles = {
        "transition": ("all " + options.transitionSpeed + "ms"),
        "position": "absolute",
        "top": (top || 0) + "px",
        "left": (left || 0) + "px",
        "width": (width || 0) + "px",
        "height": (height || 0) + "px",
        "pointer-events": "none",
        "z-index": "2147483647",
        "background-color": options.bgcolor
      };

      var styles = utils.objectToCss(_styles);

      return styles;
    };

    // inspector element creator
    var createInspector = function() {
      // create a new inspector element
      var inspector = document.createElement("div");
      inspector.id = options.namespace;

      // get inspector styles as a string
      var inspectorStyles = prepareInspectorStyles();

      if (typeof options.useInline === "boolean" && options.useInline) {
        inspector.style = inspectorStyles.replace(/(\{|\})/g, "");
      } else {
        // create style element and put styles inside
        var styleEl = document.createElement("style");
        styleEl.type = "text/css";
        
        inspectorStyles = ("#" + options.namespace + inspectorStyles);

        // check for IE support
        if (styleEl.styleSheet) {
          styleEl.styleSheet.cssText = inspectorStyles;
        } else {
          styleEl.appendChild(document.createTextNode(inspectorStyles));
        }

        document.getElementsByTagName("head")[0].appendChild(styleEl);
      }

      // append inspector element into body
      document.getElementsByTagName("body")[0].appendChild(inspector);

      // return the created element
      return inspector;
    };

    // selector query preparation function
    var getSelectorQuery = function() {
      var query = "*";

      // add all exception elements into query
      // it supports all basic css selectors
      if (options.exceptions.length) {
        for (var i = 0; i < options.exceptions.length; i++) {
          query += ":not(" + options.exceptions[i] + ")";
        }
      }

      // return the query
      return query;
    };

    // apply new options to existing one
    var applyNewOptions = function(opts) {
      // if given parameter is not valid, exit
      if (!opts) return;

      // change old values with new ones
      for (var opt in opts) {
        if (opts.hasOwnProperty(opt)) {
          options[opt] = opts[opt];
        }
      }
    };

    // event emitter function
    var eventEmitter = function(event) {
      // get target node
      var target = event.target;

      // skip itself
      if (target.id === options.namespace) return;

      switch(event.type) {
        case "click":
          eventController("onClick", target);

          break;
        case "mouseover":
          // get target element position information
          var pos = target.getBoundingClientRect();

          // get scroll top value
          var scrollTop = window.scrollY || document.documentElement.scrollTop; // IE fix

          var width = pos.width;
          var height = pos.height;
          var top = Math.max(0, pos.top + scrollTop);
          var left = pos.left;

          // get new inspector styles to be able to drag inspector on target node
          var inspectorStyles = prepareInspectorStyles(top, left, width, height).replace(/(\{|\})/g, "");
          options.inspector.setAttribute("style", inspectorStyles);

          break;
      }
    };

    // start/stop engine
    var engine = function(type) {
      // check if the given parameter is valid
      if (!type) return;

      switch(type) {
        case "start":
          // bind element click handler
          document.querySelector("body").addEventListener("click", eventEmitter);

          break;
        case "stop":
          // unbind element click handler
          document.querySelector("body").removeEventListener("click", eventEmitter);

          break;
      }

      // get all existing nodes in the page
      var query = getSelectorQuery();
      var allNodes = document.querySelectorAll(query);

      // bind mouseover event for each node
      for (var i = 0; i < allNodes.length; i++) {
        // event un/binding
        if (type === "stop") {
          allNodes[i].removeEventListener("mouseover", eventEmitter);
        } else if (type === "start") {
          allNodes[i].addEventListener("mouseover", eventEmitter);
        }
      }
    };

    // event executor
    var eventController = function(type, element) {
      // even type validation
      if (!options[type] || typeof options[type] !== "function") return;

      // execute the event if it is provided
      switch(type) {
        case "onStart":
          options.onStart.call();

          break;
        case "onStarting":
          options.onStarting.call();

          break;
        case "onStop":
          options.onStop.call();

          break;
        case "onStopping":
          options.onStopping.call();

          break;
        case "onClick":
          // pass the clicked element
          options.onClick.call(undefined, element);

          break;
      }
    };

    // start to inspect function
    var start = function(opts) {
      // override user options
      applyNewOptions(opts);

      // run onStarting event
      eventController("onStarting");

      // get an inspector element instance
      var inspector = getInspector();

      // start engine
      engine("start");

      // run onStart event
      eventController("onStart");
    };

    // stop to inspect function
    var stop = function() {
      // run onStopping event
      eventController("onStopping");

      // stop engine
      engine("stop");

      // remove the inspector
      getInspector().remove();

      options.inspector = null;

      // run onStop event
      eventController("onStop");
    };

    return {
      start: start,
      stop: stop
    };
  })(window, document);
})(window, document);
