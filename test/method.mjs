import Promise from "../promise.mjs";
import assert from "assert";

describe("Promise.method", function () {
  var obj = {};
  var error = new Error();
  var thrower = Promise.method(function () {
    throw error;
  });
  var identity = Promise.method(function (val) {
    return val;
  });
  var array = Promise.method(function () {
    return [].slice.call(arguments);
  });
  var receiver = Promise.method(function () {
    return this;
  });

  it("should reject when the function throws", function () {
    var async = false;
    var ret = thrower().then(assert.fail, function (e) {
      // console.log(e === error, async)
      assert(async);
      assert(e === error);
    });
    async = true;
    return ret;
  });

  it("should throw when the function is not a function", function () {
    try {
      Promise.method(null);
    } catch (e) {
      // console.log(e instanceof TypeError)
      assert(e instanceof TypeError);
      return;
    }
    assert.fail();
  });

  it("should call the function with the given receiver", function () {
    var async = false;
    var ret = receiver.call(obj).then(function (val) {
      // console.log(val === obj, async)
      assert(async);
      assert(val === obj);
    }, assert.fail);
    async = true;
    return ret;
  });

  it("should call the function with the given value", function () {
    var async = false;
    var ret = identity(obj).then(function (val) {
      // console.log(val === obj, async)
      assert(async);
      assert(val === obj);
    }, assert.fail);
    async = true;
    return ret;
  });

  it("should apply the function if given value is array", function () {
    var async = false;
    var ret = array(1, 2, 3).then(function (val) {
      // console.log(val, async)
      assert(async);
      assert.deepEqual(val, [1, 2, 3]);
    }, assert.fail);
    async = true;
    return ret;
  });

  it("should unwrap returned promise", function () {
    var d = Promise.defer();

    var ret = Promise.method(function () {
      return d.promise;
    })().then(function (v) {
      // console.log(v)
      assert(v === 3);
    });

    setTimeout(function () {
      d.resolve(3);
    }, 1);
    return ret;
  });

  it("should unwrap returned thenable", function () {
    return Promise.method(function () {
      return {
        then: function (f, v) {
          f(3);
        },
      };
    })().then(function (v) {
      // console.log(v)
      assert(v === 3);
    });
  });

  it("should unwrap a following promise", function () {
    var resolveF;
    var f = new Promise(function () {
      resolveF = arguments[0];
    });
    var v = new Promise(function (f) {
      setTimeout(function () {
        f(3);
      }, 1);
    });
    resolveF(v);
    return Promise.method(function () {
      return f;
    })().then(function (v) {
      // console.log(v)
      assert(v === 3);
    });
  });

  it("should retain binding from returned promise", function () {
    var THIS = { 3: 4 };
    return Promise.method(function () {
      return Promise.bind(THIS, 1);
    })().then(function (value) {
      // console.log(this, THIS, value)
      assert(THIS === this);
      assert(1 === value);
    });
  });

  it("zero arguments length should remain zero", function () {
    return Promise.method(function () {
      // console.log(arguments.length === 0)
      assert(arguments.length === 0);
    })();
  });

});
