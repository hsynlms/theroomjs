# TheRoom JS
A vanilla javascript plugin that allows you to outline dom element like web inspector. TheRoom JS works cross-browser and tested on Chrome, Firefox and Safari.

TheRoom JS can be accessed in global variable and names as `theRoom`. It exposes outside two functions, `start` and `stop`.

- **start(*options*)** : start function takes only one optional parameter that contains custom configuration.
```javascript
  // start theRoom to inspect elements
  window.theRoom.start();
```

- **stop()** : stop function does not take any parameter. It unbinds all event listeners and removes inspector instance on HTML side.
```javascript
  // stop theRoom to inspect elements
  window.theRoom.stop();
```

## Available Options
```javascript
  // custom options
  var options = {
    namespace: "theroom", // inspector element ID as string (e.g. : #theroom)
    bgcolor: "rgba(255,0,0,0.5)", // inspector element background color as hex
    transitionSpeed: 200, // inspector element transition speed (see: CSS Transition Speed)
    useInline: true, // use inline style attribute instead <style> for styling inspector element
    exceptions: [] // exception element list. inspector wont be available for them. basic css selectors are supported
  };
  
  // start theRoom to inspect elements
  window.theRoom.start(options);
```
