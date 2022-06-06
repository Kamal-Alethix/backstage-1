import { ExternalRouteRef, OptionalParams } from './types';
/**
 * Creates a route descriptor, to be later bound to a concrete route by the app. Used to implement cross-plugin route references.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}.
 *
 * @param options - Description of the route reference to be created.
 * @public
 */
export declare function createExternalRouteRef<Params extends {
    [param in ParamKey]: string;
}, Optional extends boolean = false, ParamKey extends string = never>(options: {
    /**
     * An identifier for this route, used to identify it in error messages
     */
    id: string;
    /**
     * The parameters that will be provided to the external route reference.
     */
    params?: ParamKey[];
    /**
     * Whether or not this route is optional, defaults to false.
     *
     * Optional external routes are not required to be bound in the app, and
     * if they aren't, `useRouteRef` will return `undefined`.
     */
    optional?: Optional;
}): ExternalRouteRef<OptionalParams<Params>, Optional>;
