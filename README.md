# theroomjs
> A vanilla javascript plugin that allows you to outline dom elements like web inspectors.

[![NPM](https://nodei.co/npm/theroomjs.png)](https://nodei.co/npm/theroomjs/)

theroomjs can be accessable in global variable and named as `theRoom`. It exposes outside two functions, `start` and `stop`. Its compatible with Chrome, Firefox, Safari, Internet Explorer and Edge.

Demo : https://codepen.io/hsynlms/pen/jzjOyo

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

## Available options
```javascript
  // custom options
  var options = {
    onStart: function() {}, // the function that will be fired after initialization
    onStarting: function() {}, // the function that will be fired before initialization
    onStop: function() {}, // the function that will be fired after uninitialization
    onStopping: function() {}, // the function that will be fired before uninitialization
    onClick: function(element) {}, // the function that will be fired on click on any allowed element
    showInfo: true, // show target element tag, id and class information
    template: "", // the template which will contain target element information (showInfo must be activated)
    namespace: "theroom", // inspector element ID as string (e.g. : #theroom)
    bgcolor: "rgba(255,0,0,0.5)", // inspector element background color as hex
    transitionSpeed: 200, // inspector element transition speed (see: CSS Transition Speed)
    useInline: true, // use inline style attribute instead <style> for styling inspector element
    exceptions: [] // exception element list. inspector wont be available for them. basic css selectors are supported
  };
  
  // start theRoom to inspect elements
  window.theRoom.start(options);
```

### Template example
```html
<div id="theroom-info">
  <span id="theroom-tag"></span>
  <span id="theroom-id"></span>
  <span id="theroom-class"></span>
</div>

<style>
  #theroom-info {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    font-family: "Courier";
    background-color: #ffffff;
    padding: 10px;
    color: #333333;
    text-align: center;
    box-shadow: 0px 4px 20px rgba(0,0,0,0.3);
  }

  #theroom-tag {
    color: #C2185B;
  }

  #theroom-id {
    color: #5D4037;
  }

  #theroom-class {
    color: #607D8B;
  }
</style>
```

# License
This project is licensed under the terms of the [MIT license](https://github.com/hsynlms/theroomjs/blob/master/LICENSE).
