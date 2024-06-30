/*!
 * The code following this comment originates from:
 *   https://github.com/types/npm-bluebird
 *
 * Note for browser users: use bluebird-global typings instead of this one
 * if you want to use Bluebird via the global Promise symbol.
 *
 * Licensed under:
 *   The MIT License (MIT)
 *
 *   Copyright (c) 2016 unional
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *   THE SOFTWARE.
 */

type Constructor<E> = new (...args: any[]) => E;
type CatchFilter<E> = ((error: E) => boolean) | (object & E);
type Resolvable<R> = R | PromiseLike<R>;
type IterateFunction<T, R> = (item: T, index: number, arrayLength: number) => Resolvable<R>;

declare class NativeBird<R> extends Promise<any> implements PromiseLike<R>, NativeBird.Inspection<R> {
  readonly [Symbol.toStringTag]: "Object";

  /**
   * Create a new promise. The passed in function will receive functions
   * `resolve` and `reject` as its arguments which can be called to seal the fate of the created promise.
   *
   * If promise cancellation is enabled, passed in function will receive
   * one more function argument `onCancel` that allows to register an optional cancellation callback.
   */
  constructor(callback: (resolve: (thenableOrResult?: Resolvable<R>) => void, reject: (error?: any) => void, onCancel?: (callback: () => void) => void) => void);

  /**
   * Promises/A+ `.then()`. Returns a new promise chained from this promise.
   *
   * The new promise will be rejected or resolved depending on the passed `fulfilledHandler`, `rejectedHandler` and the state of this promise.
   */
  // Based on PromiseLike.then, but returns a Bluebird instance.
  then<U>(onFulfill?: (value: R) => Resolvable<U>, onReject?: (error: any) => Resolvable<U>): NativeBird<U>; // For simpler signature help.
  then<TResult1 = R, TResult2 = never>(
      onfulfilled?: ((value: R) => Resolvable<TResult1>) | null,
      onrejected?: ((reason: any) => Resolvable<TResult2>) | null
    ): NativeBird<TResult1 | TResult2>;

  /**
   * This is a catch-all exception handler, shortcut for calling `.then(null, handler)` on this promise.
   *
   * Any exception happening in a `.then`-chain will propagate to nearest `.catch` handler.
   *
   * Alias `.caught();` for compatibility with earlier ECMAScript version.
   */
  catch<U = R>(onReject: ((error: any) => Resolvable<U>) | undefined | null): NativeBird<U | R>;

  /**
   * This extends `.catch` to work more like catch-clauses in languages like Java or C#.
   *
   * Instead of manually checking `instanceof` or `.name === "SomeError"`,
   * you may specify a number of error constructors which are eligible for this catch handler.
   * The catch handler that is first met that has eligible constructors specified, is the one that will be called.
   *
   * This method also supports predicate-based filters.
   * If you pass a predicate function instead of an error constructor, the predicate will receive the error as an argument.
   * The return result of the predicate will be used determine whether the error handler should be called.
   *
   * Alias `.caught();` for compatibility with earlier ECMAScript version.
   */
  catch<U, E1, E2, E3, E4, E5>(
    filter1: Constructor<E1>,
    filter2: Constructor<E2>,
    filter3: Constructor<E3>,
    filter4: Constructor<E4>,
    filter5: Constructor<E5>,
    onReject: (error: E1 | E2 | E3 | E4 | E5) => Resolvable<U>,
  ): NativeBird<U | R>;

  catch<U, E1, E2, E3, E4, E5>(
    filter1: Constructor<E1> | CatchFilter<E1>,
    filter2: Constructor<E2> | CatchFilter<E2>,
    filter3: Constructor<E3> | CatchFilter<E3>,
    filter4: Constructor<E4> | CatchFilter<E4>,
    filter5: Constructor<E5> | CatchFilter<E5>,
    onReject: (error: E1 | E2 | E3 | E4 | E5) => Resolvable<U>,
  ): NativeBird<U | R>;

  catch<U, E1, E2, E3, E4>(
    filter1: Constructor<E1>,
    filter2: Constructor<E2>,
    filter3: Constructor<E3>,
    filter4: Constructor<E4>,
    onReject: (error: E1 | E2 | E3 | E4) => Resolvable<U>,
  ): NativeBird<U | R>;

  catch<U, E1, E2, E3, E4>(
    filter1: Constructor<E1> | CatchFilter<E1>,
    filter2: Constructor<E2> | CatchFilter<E2>,
    filter3: Constructor<E3> | CatchFilter<E3>,
    filter4: Constructor<E4> | CatchFilter<E4>,
    onReject: (error: E1 | E2 | E3 | E4) => Resolvable<U>,
  ): NativeBird<U | R>;

  catch<U, E1, E2, E3>(
    filter1: Constructor<E1>,
    filter2: Constructor<E2>,
    filter3: Constructor<E3>,
    onReject: (error: E1 | E2 | E3) => Resolvable<U>,
  ): NativeBird<U | R>;

  catch<U, E1, E2, E3>(
    filter1: Constructor<E1> | CatchFilter<E1>,
    filter2: Constructor<E2> | CatchFilter<E2>,
    filter3: Constructor<E3> | CatchFilter<E3>,
    onReject: (error: E1 | E2 | E3) => Resolvable<U>,
  ): NativeBird<U | R>;

  catch<U, E1, E2>(
    filter1: Constructor<E1>,
    filter2: Constructor<E2>,
    onReject: (error: E1 | E2) => Resolvable<U>,
  ): NativeBird<U | R>;

  catch<U, E1, E2>(
    filter1: Constructor<E1> | CatchFilter<E1>,
    filter2: Constructor<E2> | CatchFilter<E2>,
    onReject: (error: E1 | E2) => Resolvable<U>,
  ): NativeBird<U | R>;

  catch<U, E1>(
    filter1: Constructor<E1>,
    onReject: (error: E1) => Resolvable<U>,
  ): NativeBird<U | R>;

  catch<U, E1>(
    // tslint:disable-next-line:unified-signatures
    filter1: Constructor<E1> | CatchFilter<E1>,
    onReject: (error: E1) => Resolvable<U>,
  ): NativeBird<U | R>;

  /**
   * Like `.catch` but instead of catching all types of exceptions,
   * it only catches those that don't originate from thrown errors but rather from explicit rejections.
   */
  error<U>(onReject: (reason: any) => Resolvable<U>): NativeBird<U>;

  /**
   * Pass a handler that will be called regardless of this promise's fate. Returns a new promise chained from this promise.
   *
   * There are special semantics for `.finally()` in that the final value cannot be modified from the handler.
   *
   * Alias `.lastly();` for compatibility with earlier ECMAScript version.
   */
  finally(handler: () => Resolvable<any>): NativeBird<R>;

  /**
   * Like `.finally()`, but not called for rejections.
   */
  tap(onFulFill: (value: R) => Resolvable<any>): NativeBird<R>;

  /**
   * Same as calling `Promise.delay(ms, this)`.
   */
  delay(ms: number): NativeBird<R>;

  /**
   * Returns a promise that will be fulfilled with this promise's fulfillment value or rejection reason.
   *  However, if this promise is not fulfilled or rejected within ms milliseconds, the returned promise
   *  is rejected with a TimeoutError or the error as the reason.
   *
   * You may specify a custom error message with the `message` parameter.
   */
  timeout(ms: number, message?: string | Error): NativeBird<R>;

  /**
   * Like calling `.then`, but the fulfillment value or rejection reason is assumed to be an array, which is flattened to the formal parameters of the handlers.
   */
  spread<U, Q>(this: NativeBird<R & Iterable<Q>>, fulfilledHandler: (...values: Q[]) => Resolvable<U>): NativeBird<U>;

  /**
   * Same as calling `Promise.all(thisPromise)`. With the exception that if this promise is bound to a value, the returned promise is bound to that value too.
   */
  all<T1, T2, T3, T4, T5>(this: NativeBird<[Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>, Resolvable<T5>]>): NativeBird<[T1, T2, T3, T4, T5]>;
  all<T1, T2, T3, T4>(this: NativeBird<[Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>]>): NativeBird<[T1, T2, T3, T4]>;
  all<T1, T2, T3>(this: NativeBird<[Resolvable<T1>, Resolvable<T2>, Resolvable<T3>]>): NativeBird<[T1, T2, T3]>;
  all<T1, T2>(this: NativeBird<[Resolvable<T1>, Resolvable<T2>]>): NativeBird<[T1, T2]>;
  all<T1>(this: NativeBird<[Resolvable<T1>]>): NativeBird<[T1]>;
  all<R>(this: NativeBird<Iterable<Resolvable<R>>>): NativeBird<R[]>;

  /**
   * Same as calling `Promise.all(thisPromise)`. With the exception that if this promise is bound to a value, the returned promise is bound to that value too.
   */
  all(): NativeBird<never>;

  /**
   * Same as calling `Promise.any(thisPromise)`. With the exception that if this promise is bound to a value, the returned promise is bound to that value too.
   */
  any<Q>(this: NativeBird<R & Iterable<Q>>): NativeBird<Q>;

  /**
   * Same as calling `Promise.any(thisPromise)`. With the exception that if this promise is bound to a value, the returned promise is bound to that value too.
   */
  any(): NativeBird<never>;

  /**
   * Same as calling `Promise.race(thisPromise, count)`. With the exception that if this promise is bound to a value, the returned promise is bound to that value too.
   */
  race<Q>(this: NativeBird<R & Iterable<Q>>): NativeBird<Q>;

  /**
   * Same as calling `Promise.race(thisPromise, count)`. With the exception that if this promise is bound to a value, the returned promise is bound to that value too.
   */
  race(): NativeBird<never>;

  /**
   * Same as calling `Bluebird.map(thisPromise, mapper)`. With the exception that if this promise is bound to a value, the returned promise is bound to that value too.
   */
  map<U, Q>(this: NativeBird<R & Iterable<Q>>, mapper: IterateFunction<Q, U>, options?: NativeBird.ConcurrencyOption): NativeBird<U[]>;

  /**
   * Same as calling `Bluebird.reduce(thisPromise, Function reducer, initialValue)`. With the exception that if this promise is bound to a value, the returned promise is bound to that value too.
   */
  reduce<U, Q>(this: NativeBird<R & Iterable<Q>>, reducer: (memo: U, item: Q, index: number, arrayLength: number) => Resolvable<U>, initialValue?: U): NativeBird<U>;

  /**
   * Same as calling ``Bluebird.each(thisPromise, iterator)``. With the exception that if this promise is bound to a value, the returned promise is bound to that value too.
   */
  each<Q>(this: NativeBird<R & Iterable<Q>>, iterator: IterateFunction<Q, any>): NativeBird<R>;

  /**
   * Same as calling ``Bluebird.mapSeries(thisPromise, iterator)``. With the exception that if this promise is bound to a value, the returned promise is bound to that value too.
   */
  mapSeries<U, Q>(this: NativeBird<R & Iterable<Q>>, iterator: IterateFunction<Q, U>): NativeBird<U[]>;

  /**
   * Register a node-style callback on this promise.
   * @param fn 
   */
  asCallback<R>(fn: (err: unknown, result?: unknown) => void): NativeBird<R>

  /**
   * Start the chain of promises with `Promise.try`. Any synchronous exceptions will be turned into rejections on the returned promise.
   *
   * Note about second argument: if it's specifically a true array, its values become respective arguments for the function call.
   * Otherwise it is passed as is as the first argument for the function call.
   *
   * Alias for `attempt();` for compatibility with earlier ECMAScript version.
   */
  static try<R>(fn: () => Resolvable<R>): NativeBird<R>;

  /**
   * Create a promise that is resolved with the given `value`. If `value` is a thenable or promise, the returned promise will assume its state.
   */
  static resolve(): NativeBird<void>;
  static resolve<R>(value: Resolvable<R>): NativeBird<R>;

  /**
   * Create a promise that is rejected with the given `reason`.
   */
  static reject(reason: any): NativeBird<never>;

  /**
   * @deprecated
   * Create a promise with undecided fate and return a `PromiseResolver` to control it. See resolution?: Promise(#promise-resolution).
   * @see http://bluebirdjs.com/docs/deprecated-apis.html#promise-resolution
   */
  static defer<R>(): NativeBird.Resolver<R>;

  /**
   * Returns a promise that will be resolved with value (or undefined) after given ms milliseconds.
   * If value is a promise, the delay will start counting down when it is fulfilled and the returned
   *  promise will be fulfilled with the fulfillment value of the value promise.
   */
  static delay<R>(ms: number, value: Resolvable<R>): NativeBird<R>;
  static delay(ms: number): NativeBird<void>;

  /**
   * Given an array, or a promise of an array, which contains promises (or a mix of promises and values) return a promise that is fulfilled when all the items in the array are fulfilled.
   * The promise's fulfillment value is an array with fulfillment values at respective positions to the original array.
   * If any promise in the array rejects, the returned promise is rejected with the rejection reason.
   */
  // TODO enable more overloads
  // array with promises of different types
  static all<T1, T2, T3, T4, T5>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>, Resolvable<T5>]): NativeBird<[T1, T2, T3, T4, T5]>;
  static all<T1, T2, T3, T4>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>]): NativeBird<[T1, T2, T3, T4]>;
  static all<T1, T2, T3>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>]): NativeBird<[T1, T2, T3]>;
  static all<T1, T2>(values: [Resolvable<T1>, Resolvable<T2>]): NativeBird<[T1, T2]>;
  static all<T1>(values: [Resolvable<T1>]): NativeBird<[T1]>;
  // array with values
  static all<R>(values: Resolvable<Iterable<Resolvable<R>>>): NativeBird<R[]>;

  /**
   * Like `Promise.some()`, with 1 as `count`. However, if the promise fulfills, the fulfillment value is not an array of 1 but the value directly.
   */
  static any<R>(values: Resolvable<Iterable<Resolvable<R>>>): NativeBird<R>;

  /**
   * Given an array, or a promise of an array, which contains promises (or a mix of promises and values) return a promise that is
   * fulfilled or rejected as soon as a promise in the array is fulfilled or rejected with the respective rejection reason or fulfillment value.
   *
   * **Note** If you pass empty array or a sparse array with no values, or a promise/thenable for such, it will be forever pending.
   */
  static race<R>(values: Resolvable<Iterable<Resolvable<R>>>): NativeBird<R>;

  /**
   * Map an array, or a promise of an array,
   * which contains a promises (or a mix of promises and values) with the given `mapper` function with the signature `(item, index, arrayLength)`
   * where `item` is the resolved value of a respective promise in the input array.
   * If any promise in the input array is rejected the returned promise is rejected as well.
   *
   * If the `mapper` function returns promises or thenables, the returned promise will wait for all the mapped results to be resolved as well.
   *
   * *The original array is not modified.*
   */
  static map<R, U>(
      values: Resolvable<Iterable<Resolvable<R>>>,
      mapper: IterateFunction<R, U>,
      options?: NativeBird.ConcurrencyOption
    ): NativeBird<U[]>;

  /**
   * Reduce an array, or a promise of an array,
   * which contains a promises (or a mix of promises and values) with the given `reducer` function with the signature `(total, current, index, arrayLength)`
   * where `item` is the resolved value of a respective promise in the input array.
   * If any promise in the input array is rejected the returned promise is rejected as well.
   *
   * If the reducer function returns a promise or a thenable, the result for the promise is awaited for before continuing with next iteration.
   *
   * *The original array is not modified. If no `initialValue` is given and the array doesn't contain at least 2 items,
   * the callback will not be called and `undefined` is returned.
   *
   * If `initialValue` is given and the array doesn't have at least 1 item, `initialValue` is returned.*
   */
   static reduce<R, U>(
    values: Resolvable<Iterable<Resolvable<R>>>,
    reducer: (total: U, current: R, index: number, arrayLength: number) => Resolvable<U>,
    initialValue?: U
  ): NativeBird<U>;

  /**
   * Iterate over an array, or a promise of an array,
   * which contains promises (or a mix of promises and values) with the given iterator function with the signature `(item, index, value)`
   * where item is the resolved value of a respective promise in the input array.
   * Iteration happens serially. If any promise in the input array is rejected the returned promise is rejected as well.
   *
   * Resolves to the original array unmodified, this method is meant to be used for side effects.
   * If the iterator function returns a promise or a thenable, the result for the promise is awaited for before continuing with next iteration.
   */
  static each<R>(
      values: Resolvable<Iterable<Resolvable<R>>>,
      iterator: IterateFunction<R, any>
    ): NativeBird<R[]>;

  /**
   * Given an Iterable(arrays are Iterable), or a promise of an Iterable, which produces promises (or a mix of promises and values),
   * iterate over all the values in the Iterable into an array and iterate over the array serially, in-order.
   *
   * Returns a promise for an array that contains the values returned by the iterator function in their respective positions.
   * The iterator won't be called for an item until its previous item, and the promise returned by the iterator for that item are fulfilled.
   * This results in a mapSeries kind of utility but it can also be used simply as a side effect iterator similar to Array#forEach.
   *
   * If any promise in the input array is rejected or any promise returned by the iterator function is rejected, the result will be rejected as well.
   */
  static mapSeries<R, U>(
      values: Resolvable<Iterable<Resolvable<R>>>,
      iterator: IterateFunction<R, U>
    ): NativeBird<U[]>;

  /**
   * Create a new promise. The passed in function will receive functions `resolve` and `reject` as its arguments which can be called to seal the fate of the created promise.
   * If promise cancellation is enabled, passed in function will receive one more function argument `onCancel` that allows to register an optional cancellation callback.
   */
  static Promise: typeof NativeBird;
}

declare namespace NativeBird {
  interface ConcurrencyOption {
    concurrency: number;
  }
  interface SpreadOption {
    spread: boolean;
  }
  interface FromNodeOptions {
    multiArgs?: boolean;
  }
  interface PromisifyOptions {
    context?: any;
    multiArgs?: boolean;
  }
  interface PromisifyAllOptions<T> extends PromisifyOptions {
    suffix?: string;
    filter?(name: string, func: (...args: any[]) => any, target?: any, passesDefaultFilter?: boolean): boolean;
    // The promisifier gets a reference to the original method and should return a function which returns a promise
    promisifier?(this: T, originalMethod: (...args: any[]) => any, defaultPromisifer: (...args: any[]) => (...args: any[]) => NativeBird<any>): () => PromiseLike<any>;
  }
  interface CoroutineOptions {
    yieldHandler(value: any): any;
  }

  type ResolvableProps<T> = object & {[K in keyof T]: Resolvable<T[K]>};

  interface Resolver<R> {
    /**
     * Returns a reference to the controlled promise that can be passed to clients.
     */
    promise: NativeBird<R>;

    /**
     * Resolve the underlying promise with `value` as the resolution value. If `value` is a thenable or a promise, the underlying promise will assume its state.
     */
    resolve(value: R): void;
    resolve(): void;

    /**
     * Reject the underlying promise with `reason` as the rejection reason.
     */
    reject(reason: any): void;

    /**
     * Gives you a callback representation of the `PromiseResolver`. Note that this is not a method but a property.
     * The callback accepts error object in first argument and success values on the 2nd parameter and the rest, I.E. node js conventions.
     *
     * If the the callback is called with multiple success values, the resolver fulfills its promise with an array of the values.
     */
    // TODO specify resolver callback
    callback(err: any, value: R, ...values: R[]): void;
  }

  interface Inspection<R> {}
}

export = NativeBird;