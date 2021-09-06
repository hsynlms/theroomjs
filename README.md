# theroomjs
> A vanilla javascript plugin that allows you to outline DOM elements like web inspectors.

[![Downloads](https://img.shields.io/npm/dm/theroomjs.svg)](https://npmjs.com/theroomjs)
[![install size](https://packagephobia.com/badge?p=theroomjs)](https://packagephobia.com/result?p=theroomjs)

`theroomjs` can be accessable globally as `theRoom`. It's compatible with modern browsers such as Google Chrome, Mozilla Firefox, Safari, Edge and Internet Explorer.

## Install
```
$ npm install theroomjs --save
```

## Usage

```javascript
  // setup/configure theRoom before inspection
  // this configurations can be passed in 'start' event as well
  window.theRoom.configure({
    inspector: '.inspector-element',
    blockRedirection: true,
    excludes: ['footer'],
    click: function (element) {
      console.log('element is clicked:', element)
    }
  })

  // start inspection
  window.theRoom.start()

  // dynamically bind event
  window.theRoom.on('mouseover', function (element) {
    console.log('the element is hovered', element)
  })

  // stop inspection
  // and reset inspector styles
  window.theRoom.stop(true)

  // dont emit mouseover and click events
  // if the target element id is 'yusufHayaloglu'
  window.theRoom.on('hook', function (event) {
    if (event.target.id === 'yusufHayaloglu') {
      return false
    }
  })

  console.log(
    window.theRoom.status() // will print out -> stopped
  )
```

## Options

| Name              | Type               | Default    | Description                                                  |
| ---               | ---                | ---        | ---                                                          |
| inspector         | string or DOM node | -          | Placeholder element for inspection. It will not be inspected |
| createInspector   | boolean            | false      | If `true` and inspector option is not provided, theRoom will try to create an inspector element whose class is `inspector-element` for you and will be appended to `<body/>` |
| htmlClass         | boolean            | true       | If `true` theRoom's namespace will be automatically added to `<html/>` element class list |
| blockRedirection  | boolean            | false      | If `true` the page will not be redirected elsewhere. theRoom will override `onbeforeunload` to do that |
| excludes          | array (string)     | -          | Elements that excluded for inspection. Basic CSS selectors are allowed. For more information please see [document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) |

## Events

| Name       | Description                                              |
| ---        | ---                                                      |
| starting   | Fired when inspection is being started                   |
| started    | Fired when inspection is started                         |
| stopping   | Fired when inspection is being stopped                   |
| stopped    | Fired when inspection is stopped                         |
| click      | Fired when the inspected element is clicked. The element is passed as the first argument, [Event](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) passed as the second argument |
| mouseover  | Fired when the inspected element mouseovered. The element is passed as the first argument, [Event](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) passed as the second argument |
| hook       | Fired before `click` and `mouseover` events. [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) passed as the only argument. **mouseover** and **click** events wont be emitted if the hook event returns `false` |

> Events can also be defined in options.

## theRoom object

`theRoom` global object exposes those:

| Option            | Type     | Parameters                          | Description                                               |
| ---               | ---      | ---                                 | ---                                                       |
| on                | function | `event name` and `handler function` | To dynamically event binding                              |
| start             | function | `options` (optional)                | To start inspection                                       |
| stop              | function | `resetInspector` (optional)         | To stop inspection                                        |
| configure         | function | `options`                           | To override theRoom option(s) anytime                     |
| status            | function | -                                   | Gets inspection engine status. Can be `idle`, `running` and `stopped` |

## Related
- [path-finder](https://github.com/hsynlms/path-finder) - A Chrome extension to inspect and find out an HTML element unique CSS selector
