class NPromise extends Promise {
  _bound = undefined;

  /**
   * @warning NPromise.bind is not well tested
   */
  bind(thisArg) {
    this._bound = thisArg;
    return this;
  }

  delay(ms = 0) {
    return this.then((value) => NPromise.delay(ms, value));
  }

  map(fn, options) {
    return this.then((arr) => NPromise.map(arr, fn, options));
  }

  mapSeries(fn) {
    return this.then((arr) => NPromise.mapSeries(arr, fn));
  }

  each(fn) {
    return this.then((arr) => NPromise.each(arr, fn));
  }

  timeout(ms = 0, msg) {
    const timeoutPromise = new NPromise((_, reject) => {
      setTimeout(
        () =>
          reject(
            msg instanceof Error ? msg : new Error(msg || "Request timed out"),
          ),
        ms,
      );
    });
    return NPromise.race([this, timeoutPromise]);
  }

  tap(fn) {
    return new NPromise((resolve, reject) => {
      this.then(async (val) => {
        await fn(val);
        resolve(val);
      }).catch(reject);
    });
  }

  all() {
    return this.then((arr) => NPromise.all(arr));
  }

  spread(fn) {
    return this.then(function () {
      if (typeof fn !== "function") {
        throw new TypeError(
          `Promise.spread requires function, but got ${typeof fn}`,
        );
      }

      return fn.apply(null, arguments[0]);
    });
  }

  reduce(fn, initialValue) {
    return NPromise.reduce(this, fn, initialValue);
  }
  asCallback(callback) {
    if (typeof callback !== "function") {
      return this;
    }

    this.then(
      (value) => {
        queueMicrotask(() => {
          try {
            callback(null, value);
          } catch (err) {
            queueMicrotask(() => {
              throw err;
            });
          }
        });
      },
      (error) => {
        queueMicrotask(() => {
          try {
            if (!error) {
              error = new Error("Promise rejected without a reason", {
                cause: error,
              });
            }
            callback(error);
          } catch (err) {
            queueMicrotask(() => {
              throw err;
            });
          }
        });
      },
    );

    return this;
  }
}

NPromise.delay = function delay(ms = 0, value) {
  return new NPromise((resolve) => setTimeout(() => resolve(value), ms));
};

NPromise.attempt = NPromise.try = function (fn) {
  return new NPromise(function (resolve, reject) {
    if (typeof fn !== "function") {
      reject(
        new TypeError(`Promise.try requires function, but got ${typeof fn}`),
      );
    }
    resolve(fn());
  });
};

// TODO refactor with Symbol.Iterable
NPromise.each = async function each(arr, fn) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Promise.each requires array, but got ${typeof arr}`);
  }
  const values = [];
  for (let i = 0; i < arr.length; i++) {
    const val = await NPromise.resolve(arr[i]);
    values.push(val);
    await fn(val, i, arr.length);
  }
  return values;
};

// TODO refactor with Symbol.Iterable
NPromise.mapSeries = function mapSeries(arr, fn) {
  if (!Array.isArray(arr)) {
    throw new TypeError(
      `Promise.mapSeries requires array, but got ${typeof arr}`,
    );
  }
  return new NPromise(async (resolve, reject) => {
    const results = [];
    for (let i = 0; i < arr.length; i++) {
      try {
        const val = await NPromise.resolve(arr[i]);
        results[i] = await fn(val, i, arr.length);
      } catch (err) {
        reject(err);
      }
    }
    resolve(results);
  });
};

NPromise.map = function map(iterable, fn, options) {
  options = options || {};
  let concurrency = options.concurrency || Infinity;

  let index = 0;
  const results = [];

  if ("then" in iterable) {
    return iterable.then((arr) => {
      if (!Array.isArray(arr)) {
        throw new TypeError(
          `Promise.map requires array, but got ${typeof arr}`,
        );
      }
      return NPromise.map(arr, fn, options);
    });
  }

  const iterator = iterable[Symbol.iterator]();
  const promises = [];

  while (concurrency-- > 0) {
    const promise = wrappedMapper();
    if (promise) promises.push(promise);
    else break;
  }

  return NPromise.all(promises).then(() => results);

  function wrappedMapper() {
    const next = iterator.next();
    if (next.done) return null;
    const i = index++;
    return Promise.resolve(next.value).then(async (unwrapped) => {
      const mapped = await fn(unwrapped, i);
      results[i] = mapped;
      return wrappedMapper(mapped);
    });
  }
};

NPromise.defer = function defer() {
  let resolve, reject;
  const promise = new NPromise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    resolve,
    reject,
    promise,
  };
};

NPromise.reduce = async function reduce(iterable, fn, initialValue) {
  if (typeof fn !== "function") {
    throw new TypeError(
      `Promise.reduce requires function, but got ${typeof fn}`,
    );
  }
  return NPromise.all(await iterable).then(async (list) => {
    const iterator = list[Symbol.iterator]();
    let ret = await initialValue;
    let item = null;
    let idx = -1;
    while (((item = iterator.next()), !item.done)) {
      ret = ++idx === 0 && ret === undefined
        ? await item.value
        : await fn(ret, item.value, idx, list.length);
    }
    return ret;
  });
};

/**
 * @warning NPromise.bind is not well tested
 */
NPromise.bind = function bind(thisArg, value) {
  return NPromise.resolve(value).bind(thisArg, value);
};

NPromise.method = function (fn) {
  if (typeof fn !== "function") {
    throw new TypeError(
      `Promise.method requires function, but got ${typeof fn}`,
    );
  }
  return function (...args) {
    let res
    try {
      res = fn.apply(this, args);
    } catch (e) {
      return NPromise.reject(e);
    }
    // It seems we can not use NPromise.resolve(res) here,
    // because of Promise.resolve cant bind thisArg
    return {
      async then(onFulfilled, onRejected) {
        try {
          onFulfilled.bind(res?._bound)(await NPromise.resolve(res));
        } catch(e) {
          onRejected(await NPromise.reject(e))
        }
      }
    };
  }
};

export default NPromise;
