import { RouteRef, OptionalParams } from './types';
/**
 * Create a {@link RouteRef} from a route descriptor.
 *
 * @param config - Description of the route reference to be created.
 * @public
 */
export declare function createRouteRef<Params extends {
    [param in ParamKey]: string;
}, ParamKey extends string = never>(config: {
    /** The id of the route ref, used to identify it when printed */
    id: string;
    /** A list of parameter names that the path that this route ref is bound to must contain */
    params?: ParamKey[];
}): RouteRef<OptionalParams<Params>>;
