/*
* TheRoom JS v1.0.1
* A vanilla javascript plugin that allows you to outline dom element like web inspector.
* Works on Chrome, Firefox and Safari
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
              css += key + ":" + obj[key] + ";";
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

    // inspector element creator
    var createInspector = function() {
      // create a new inspector element
      var inspector = document.createElement("div");
      inspector.id = options.namespace;

      // prepare inspector element styles
      var styles = {
        "transition": ("all " + options.transitionSpeed + "ms"),
        "position": "absolute",
        "top": 0,
        "left": 0,
        "pointer-events": "none",
        "z-index": "2147483647",
        "background-color": options.bgcolor
      };

      var inspectorStyles = utils.objectToCss(styles);

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
          var scrollTop = window.scrollY;

          var width = pos.width;
          var height = pos.height;
          var top = Math.max(0, pos.top + scrollTop);
          var left = pos.left;

          // drag highligter on target node
          options.inspector.style.width = width + "px";
          options.inspector.style.height = height + "px";
          options.inspector.style.top = top + "px";
          options.inspector.style.left = left + "px";

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
