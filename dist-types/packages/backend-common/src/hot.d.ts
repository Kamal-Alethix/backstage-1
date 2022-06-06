/// <reference types="node" />
/// <reference types="webpack-env" />
/**
 * useHotCleanup allows cleanup of ongoing effects when a module is
 * hot-reloaded during development. The cleanup function will be called
 * whenever the module itself or any of its parent modules is hot-reloaded.
 *
 * Useful for cleaning intervals, timers, requests etc
 *
 * @public
 * @example
 * ```ts
 * const intervalId = setInterval(doStuff, 1000);
 * useHotCleanup(module, () => clearInterval(intervalId));
 * ```
 * @param _module - Reference to the current module where you invoke the fn
 * @param cancelEffect - Fn that cleans up the ongoing effects
 */
export declare function useHotCleanup(_module: NodeModule, cancelEffect: () => void): void;
/**
 * Memoizes a generated value across hot-module reloads. This is useful for
 * stateful parts of the backend, e.g. to retain a database.
 *
 * @public
 * @example
 * ```ts
 * const db = useHotMemoize(module, () => createDB(dbParams));
 * ```
 *
 * **NOTE:** Do not use inside conditionals or loops,
 * same rules as for hooks apply (https://reactjs.org/docs/hooks-rules.html)
 *
 * @param _module - Reference to the current module where you invoke the fn
 * @param valueFactory - Fn that returns the value you want to memoize
 */
export declare function useHotMemoize<T>(_module: NodeModule, valueFactory: () => T): T;
