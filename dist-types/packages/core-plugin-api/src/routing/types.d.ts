/**
 * Catch-all type for route params.
 *
 * @public
 */
export declare type AnyParams = {
    [param in string]: string;
} | undefined;
/**
 * Type describing the key type of a route parameter mapping.
 *
 * @public
 */
export declare type ParamKeys<Params extends AnyParams> = keyof Params extends never ? [] : (keyof Params)[];
/**
 * Optional route params.
 *
 * @public
 */
export declare type OptionalParams<Params extends {
    [param in string]: string;
}> = Params[keyof Params] extends never ? undefined : Params;
/**
 * TS magic for handling route parameters.
 *
 * @remarks
 *
 * The extra TS magic here is to require a single params argument if the RouteRef
 * had at least one param defined, but require 0 arguments if there are no params defined.
 * Without this we'd have to pass in empty object to all parameter-less RouteRefs
 * just to make TypeScript happy, or we would have to make the argument optional in
 * which case you might forget to pass it in when it is actually required.
 *
 * @public
 */
export declare type RouteFunc<Params extends AnyParams> = (...[params]: Params extends undefined ? readonly [] : readonly [Params]) => string;
/**
 * Absolute route reference.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}.
 *
 * @public
 */
export declare type RouteRef<Params extends AnyParams = any> = {
    $$routeRefType: 'absolute';
    params: ParamKeys<Params>;
};
/**
 * Descriptor of a route relative to an absolute {@link RouteRef}.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}.
 *
 * @public
 */
export declare type SubRouteRef<Params extends AnyParams = any> = {
    $$routeRefType: 'sub';
    parent: RouteRef;
    path: string;
    params: ParamKeys<Params>;
};
/**
 * Route descriptor, to be later bound to a concrete route by the app. Used to implement cross-plugin route references.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}.
 *
 * @public
 */
export declare type ExternalRouteRef<Params extends AnyParams = any, Optional extends boolean = any> = {
    $$routeRefType: 'external';
    params: ParamKeys<Params>;
    optional?: Optional;
};
