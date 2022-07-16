# NativeBird

Ultralight promise extension compatible with Bluebird

<a href="./package.json">
  <img src="https://img.shields.io/npm/v/nativebird.svg?maxAge=300&color=f4e335"/>
</a>
<a href="./package.json">
  <img src="https://img.shields.io/bundlephobia/min/nativebird"/>
</a>
<a href="./package.json">
  <!-- NOTE after "npm run coverage", check whether next line of code formatted correctly -->
  <img src="https://img.shields.io/badge/Coverage-95%25-83A603.svg?prefix=$coverage$">
</a>

![logo](./logo.png)

## Introduction

[中文介绍](https://zhuanlan.zhihu.com/p/536154525)

As a pioneer in JavaScript async ecosystem, [Bluebird](http://bluebirdjs.com/) is a great userland promise library with handy utility methods included. However the way it works leads to larger bundle size and more verbose stack trace.

NativeBird is compatible with a core Bluebird subset by extending native promise, and all of its extended APIs (implemented within ~200 lines) are fully tested with the corresponding test cases in Bluebird.

NativeBird can be used in several scenarios:

- To reuse promise utility methods like `Promise.map` and `Promise.each` without copying snippets from a gist.
- To perform migration in existing Bluebird projects.
- To simply learn JavaScript async operation skills 🐶.

## Installation

```sh
npm install nativebird
```

```js
import Promise from "nativebird";
```

It's also fine to copy `promise.mjs` and its type definition directly into your project directory.

## API

- Static methods:
  - [`Promise.delay`](http://bluebirdjs.com/docs/api/promise.delay.html)
  - [`Promise.try`](http://bluebirdjs.com/docs/api/promise.try.html)
  - [`Promise.each`](http://bluebirdjs.com/docs/api/promise.each.html)
  - [`Promise.mapSeries`](http://bluebirdjs.com/docs/api/promise.mapseries.html)
  - [`Promise.map`](http://bluebirdjs.com/docs/api/promise.map.html)
  - [`Promise.reduce`](http://bluebirdjs.com/docs/api/promise.reduce.html)
  - `Promise.defer` (deprecated)
- Instance methods:
  - [`promise.delay`](http://bluebirdjs.com/docs/api/delay.html)
  - [`promise.map`](http://bluebirdjs.com/docs/api/map.html)
  - [`promise.map`](http://bluebirdjs.com/docs/api/reduce.html)
  - [`promise.mapSeries`](http://bluebirdjs.com/docs/api/mapseries.html)
  - [`promise.each`](http://bluebirdjs.com/docs/api/each.html)
  - [`promise.timeout`](http://bluebirdjs.com/docs/api/timeout.html)
  - [`promise.tap`](http://bluebirdjs.com/docs/api/tap.html)
  - [`promise.all`](http://bluebirdjs.com/docs/api/all.html)
  - [`promise.spread`](http://bluebirdjs.com/docs/api/spread.html)

Since NativeBird inherits from native promise, all promise APIs defined in ECMAScript standard (say [`Promise.allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) and [`Promise.any`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)) are naturally supported.

## Caveats

- `Promise.cancel` is not supported.
- Synchronous inspection (e.g. `Promise.isFulfilled`) is not supported.

## Contribution

To implement a new API in Bluebird, please also port the corresponding test cases under `test/mocha` in Bluebird repo and test it with `npm test`.

## License

MIT
