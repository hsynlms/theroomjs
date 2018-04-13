# TheRoom JS
A vanilla javascript plugin that allows you to outline dom elements like web inspectors. TheRoom JS works with Chrome, Firefox, Safari, Internet Explorer and Edge.

TheRoom JS can be accessable in global variable and named as `theRoom`. It exposes outside two functions, `start` and `stop`.

- **start(*options*)** : start function takes only one optional parameter for custom options.
```javascript
  // start theRoom to inspect elements
  window.theRoom.start();
```

- **stop()** : stop function unbinds all event listeners for HTML nodes and removes the inspector instance on HTML side.
```javascript
  // stop theRoom to inspect elements
  window.theRoom.stop();
```

## Available Options
```javascript
  // custom options
  var options = {
    onStart: function() {}, // the function that will be fired after initialization
    onStarting: function() {}, // the function that will be fired before initialization
    onStop: function() {}, // the function that will be fired after uninitialization
    onStopping: function() {}, // the function that will be fired before uninitialization
    onClick: function(element) {}, // the function that will be fired on click on any allowed element
    namespace: "theroom", // inspector element ID as string (e.g. : #theroom)
    bgcolor: "rgba(255,0,0,0.5)", // inspector element background color as hex
    transitionSpeed: 200, // inspector element transition speed (see: CSS Transition Speed)
    useInline: true, // use inline style attribute instead <style> for styling inspector element
    exceptions: [] // exception element list. inspector wont be available for them. basic css selectors are supported
  };
  
  // start theRoom to inspect elements
  window.theRoom.start(options);
```
