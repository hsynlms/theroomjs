# theroomjs
> A vanilla javascript plugin that allows you to outline dom elements like web inspectors.

[![NPM](https://nodei.co/npm/theroomjs.png)](https://nodei.co/npm/theroomjs/)

`theroomjs` can be accessable globally as `theRoom`. It's compatible with modern browsers such as Google Chrome, Mozilla Firefox, Safari, Edge and Internet Explorer.

## Options

| Name              | Type               | Default    | Description                         |
| ---               | ---                | ---        | ---                                 |
| inspector         | string or DOM node | -          | Placeholder element for inspection. It will not be inspected  |
| htmlClass         | boolean            | true       | If `true` namespace theRoom will be automatically added to `<html>` element class list |
| blockRedirection  | boolean            | false      | If `true` the page will not be redirected elsewhere. The library will override `onbeforeunload` for prevention |
| excludes          | array              | ['meta', 'link', 'style', 'script'] | Element list that excluded for inspection. Basic CSS selectors are allowed. For more information please see [document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) |

## Events

| Name              | Type     | Default | Description                                              |
| ---               | ---      | ---     | ---                                                      |
| starting          | function | null    | Fired when inspection is being started inspection        |
| started           | function | null    | Fired when inspection is started inspection              |
| stopping          | function | null    | Fired when inspection is being stopped                   |
| stopped           | function | null    | Fired when inspection is stopped                         |
| click             | function | null    | Fired when inspected element is clicked. The element will be passed as first argument  |
| mouseover         | function | null    | Fired when inspected element mouseovered. The element will be passed as first argument |
| hook              | function | null    | Fired at the very beginning of `click` and `mouseover` event listeners. [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) passed as argument |

> Events can also be defined in options.

## theRoom object

`theRoom` object contains properties which are listed in below table.

| Option            | Type     | Parameters                          | Description                                               |
| ---               | ---      | ---                                 | ---                                                       |
| on                | function | `event name` and `handler function` | Event binder (dynamic binding supported)                  |
| start             | function | `options`                           | Starting inspection                                       |
| stop              | function | -                                   | Stopping inspection                                       |
| status            | string   | -                                   | Inspection status. Can be `idle`, `running` and `stopped` |

## Usage

```javascript
  // start inspection
  window.theRoom.start({
    inspector: '.inspector-element',
    blockRedirection: true,
    excludes: ['footer']
  })

  // stop inspection
  window.theRoom.stop()

  // dynamically event binding
  window.theRoom.on('click', function () {
    console.log('clicked')
  })

  // log the current status
  console.log(window.theRoom.status)
```

## Contribution
Contributions and pull requests are kindly welcomed!

## License
This project is licensed under the terms of the [MIT license](https://github.com/hsynlms/theroomjs/blob/master/LICENSE).
