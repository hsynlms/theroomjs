# theroomjs
> A vanilla javascript plugin that allows you to outline dom elements like web inspectors.

[![NPM](https://nodei.co/npm/theroomjs.png)](https://nodei.co/npm/theroomjs/)

theroomjs can be accessable in global variable as `theRoom`. Its compatible with modern browsers such as Google Chrome, Mozilla Firefox, Safari, Edge and Internet Explorer as a plus.

## Options

| Name              | Type               | Default                             | Description                                                                                                          |
| ---               | ---                | ---                                 | ---                                                                                                                  |
| inspector         | string or DOM node | null                                | Placeholder element for inspection. It won't be inspected (excluded)                                                 |
| htmlClass         | boolean            | true                                | If `true` it will automatically add its namespace as class name to HTML element                                      |
| blockRedirection  | boolean            | false                               | If `true` it will prevent the page to be redirected elsewhere by setting up `onbeforeunload`                         |
| excludes          | array              | ['meta', 'link', 'style', 'script'] | Excluded element list for inspection. Basic CSS selectors are allowed. For more information `document.querySelector` |

## Events

| Name              | Type     | Default | Description                                                                                                                                                |
| ---               | ---      | ---     | ---                                                                                                                                                        |
| starting          | function | null    | Fired before starting inspection                                                                                                                           |
| started           | function | null    | Fired after starting inspection                                                                                                                            |
| stopping          | function | null    | Fired before ending inspection                                                                                                                             |
| stopped           | function | null    | Fired after ending inspection                                                                                                                              |
| click             | function | null    | Fired when click event is triggered on an inspected element. The element passed as argument                                                                |
| mouseover         | function | null    | Fired when mouseover event is triggered on an inspected element. The element passed as argument                                                            |
| hook              | function | null    | Fired at the very beginning of `click` and `mouseover` event listeners. [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) passed as argument |

> All events also may be defined in the options.

## Deprecated (v1)

| Option            | Description     |
| ---               | ---             |
| onStart           | See `started`   |
| onStarting        | See `starting`  |
| onStop            | See `stopped`   |
| onStopping        | See `stopping`  |
| onClick           | See `click`     |
| showInfo          | X               |
| template          | X               |
| namespace         | X               |
| bgcolor           | X               |
| transitionSpeed   | X               |
| useInline         | X               |
| exceptions        | See `excludes`  |

## theRoom exposed object

Exposed object contains four properties.

| Option            | Type     | Parameters                          | Description                                               |
| ---               | ---      | ---                                 | ---                                                       |
| on                | function | `event name` and `handler function` | Dynamically event binding                                 |
| start             | function | `options`                           | Starting inspection                                       |
| stop              | function | -                                   | Stopping inspection                                       |
| status            | string   | -                                   | Inspection status. Can be `idle`, `running` and `stopped` |

```javascript
  // start inspection
  window.theRoom.start({
    inspector: '.inspector-element',
    blockRedirection: true,
    excludes: ['footer']
  });

  // stop inspection
  window.theRoom.stop();

  // dynamically bind event
  window.theRoom.on('click', function() {
    console.log('clicked');
  });

  console.log(window.theRoom.status);
```

# License
This project is licensed under the terms of the [MIT license](https://github.com/hsynlms/theroomjs/blob/master/LICENSE).
