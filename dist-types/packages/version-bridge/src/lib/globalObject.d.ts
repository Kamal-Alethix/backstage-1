/**
 * Serializes access to a global singleton value, with the first caller creating the value.
 *
 * @public
 */
export declare function getOrCreateGlobalSingleton<T>(id: string, supplier: () => T): T;
