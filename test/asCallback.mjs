import Promise from "../promise.mjs";
import assert from "assert";

function awaitGlobalException(fn) {
  function replaceListeners(by) {
      var single = typeof by === "function";
      if (process.title === "browser") {
          var original = window.onerror;
          window.onerror = single ? function(message, file, line, column, e) {
              return by(e);
          } : by[0];
          return [original];
      } else {
          var original = process.listeners("uncaughtException");
          process.removeAllListeners("uncaughtException");
          if (single) by = [by];
          by.forEach(function(listener) {
              process.on("uncaughtException", listener);
          });
          return original;
      }
  }
  return new Promise(function(resolve, reject) {
    var listeners = replaceListeners(function(e) {
        var err;
        var ret;
        try {
            ret = fn(e);
        } catch (e) {
            err = e;
        }
        if (!err && ret === false) return;
        replaceListeners(listeners);
        Promise.delay(1).then(function() {
            if (err) reject(err);
            resolve();
        });
    });
});
}

function getSpy() {
  var resolve, reject;
  var promise = new Promise(function() {
      resolve = arguments[0];
      reject = arguments[1];
  });
  var ret = function(fn) {
      ret.callback = fn;
      return ret.node;
  };
  ret.promise = promise;
  ret.node = function() {
      try {
          ret.callback.apply(this, arguments);
          resolve();
      } catch (e) {
          reject(e);
      }
  };
  return ret;
}

describe("Promise.asCallback", function () {
  var e = new Error();
  function thrower() {
      throw e;
  }

  it("throws normally in the node process if the function throws", function() {
      var promise = Promise.resolve(10);
      var turns = 0;
      process.nextTick(function(){
          turns++;
      });
      promise.asCallback(thrower);
      return awaitGlobalException(function(err) {
          assert(err === e);
          assert(turns === 1);
      });
  });

  it("always returns promise for now", function() {
      return Promise.resolve(3).asCallback().then(function() {
          var a = 0;
          Promise.resolve(3).asCallback(function(){
              a++;
          }).then(function() {
              assert(1 == 1);
          });
      });
  });

  describe("promise rejected with falsy values", function() {
      specify("no reason", function() {
          var spy = getSpy();
          Promise.reject().asCallback(spy(function(err) {
              assert.strictEqual(arguments.length, 1);
              assert.strictEqual(err.cause, undefined);
          }));
          return spy.promise;
      });
      specify("null reason", function() {
          var spy = getSpy();
          Promise.reject(null).asCallback(spy(function(err) {
              assert.strictEqual(arguments.length, 1);
              assert.strictEqual(err.cause, null);
          }));
          return spy.promise;
      });
      specify("nodefying a follewer promise", function() {
          var spy = getSpy();
          new Promise(function(resolve, reject) {
              resolve(new Promise(function(_, reject) {
                  setTimeout(function() {
                      reject();
                  }, 1);
              }))
          }).asCallback(spy(function(err) {
              assert.strictEqual(arguments.length, 1);
              assert.strictEqual(err.cause, undefined);
          }));
          return spy.promise;
      });
      specify("nodefier promise becomes follower", function() {
          var spy = getSpy();
          Promise.resolve(1).then(function() {
              return new Promise(function(_, reject) {
                  setTimeout(function() {
                      reject();
                  }, 1);
              });
          }).asCallback(spy(function(err) {
              assert.strictEqual(arguments.length, 1);
              assert.strictEqual(err.cause, undefined);
          }));
          return spy.promise;
      });
  });

  it("should work then result is not an array", function() {
      var spy = getSpy();
      Promise.resolve(3).asCallback(spy(function(err, a) {
          assert(err === null);
          assert(a === 3);
      }), {spread: true});
      return spy.promise;
  });

  it("should work if the callback throws when spread", function() {
      var err = new Error();
      Promise.resolve([1,2,3]).asCallback(function(_, a) {
          throw err;
      }, {spread: true});

      return awaitGlobalException(function(e) {
          assert.strictEqual(err, e);
      });
  });

  it("should work if the callback throws when rejected", function() {
      var err = new Error();
      Promise.reject(new Error()).asCallback(function(_, a) {
          throw err;
      });

      return awaitGlobalException(function(e) {
          assert.strictEqual(err, e);
      });
  });
})