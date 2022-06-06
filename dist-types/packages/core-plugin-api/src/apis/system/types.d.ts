/**
 * API reference.
 *
 * @public
 */
export declare type ApiRef<T> = {
    id: string;
    T: T;
};
/**
 * Catch-all {@link ApiRef} type.
 *
 * @public
 */
export declare type AnyApiRef = ApiRef<unknown>;
/**
 * Wraps a type with API properties into a type holding their respective {@link ApiRef}s.
 *
 * @public
 */
export declare type TypesToApiRefs<T> = {
    [key in keyof T]: ApiRef<T[key]>;
};
/**
 * Provides lookup of APIs through their {@link ApiRef}s.
 *
 * @public
 */
export declare type ApiHolder = {
    get<T>(api: ApiRef<T>): T | undefined;
};
/**
 * Describes type returning API implementations.
 *
 * @public
 */
export declare type ApiFactory<Api, Impl extends Api, Deps extends {
    [name in string]: unknown;
}> = {
    api: ApiRef<Api>;
    deps: TypesToApiRefs<Deps>;
    factory(deps: Deps): Impl;
};
/**
 * Catch-all {@link ApiFactory} type.
 *
 * @public
 */
export declare type AnyApiFactory = ApiFactory<unknown, unknown, {
    [key in string]: unknown;
}>;
