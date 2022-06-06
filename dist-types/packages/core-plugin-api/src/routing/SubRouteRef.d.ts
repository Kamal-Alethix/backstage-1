import { AnyParams, OptionalParams, RouteRef, SubRouteRef } from './types';
/**
 * Used in {@link PathParams} type declaration.
 * @public
 */
export declare type ParamPart<S extends string> = S extends `:${infer Param}` ? Param : never;
/**
 * Used in {@link PathParams} type declaration.
 * @public
 */
export declare type ParamNames<S extends string> = S extends `${infer Part}/${infer Rest}` ? ParamPart<Part> | ParamNames<Rest> : ParamPart<S>;
/**
 * This utility type helps us infer a Param object type from a string path
 * For example, `/foo/:bar/:baz` inferred to `{ bar: string, baz: string }`
 * @public
 */
export declare type PathParams<S extends string> = {
    [name in ParamNames<S>]: string;
};
/**
 * Merges a param object type with with an optional params type into a params object.
 * @public
 */
export declare type MergeParams<P1 extends {
    [param in string]: string;
}, P2 extends AnyParams> = (P1[keyof P1] extends never ? {} : P1) & (P2 extends undefined ? {} : P2);
/**
 * Creates a SubRouteRef type given the desired parameters and parent route parameters.
 * The parameters types are merged together while ensuring that there is no overlap between the two.
 *
 * @public
 */
export declare type MakeSubRouteRef<Params extends {
    [param in string]: string;
}, ParentParams extends AnyParams> = keyof Params & keyof ParentParams extends never ? SubRouteRef<OptionalParams<MergeParams<Params, ParentParams>>> : never;
/**
 * Create a {@link SubRouteRef} from a route descriptor.
 *
 * @param config - Description of the route reference to be created.
 * @public
 */
export declare function createSubRouteRef<Path extends string, ParentParams extends AnyParams = never>(config: {
    id: string;
    path: Path;
    parent: RouteRef<ParentParams>;
}): MakeSubRouteRef<PathParams<Path>, ParentParams>;
