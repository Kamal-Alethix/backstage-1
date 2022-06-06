import { RouteRef, SubRouteRef, ExternalRouteRef } from '../routing';
import { AnyApiFactory } from '../apis/system';
/**
 * Plugin extension type.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#extensions}.
 *
 * @public
 */
export declare type Extension<T> = {
    expose(plugin: BackstagePlugin<any, any>): T;
};
/**
 * Catch-all route type.
 *
 * @public
 */
export declare type AnyRoutes = {
    [name: string]: RouteRef | SubRouteRef;
};
/**
 * Catch-all type for {@link ExternalRouteRef}s.
 *
 * @public
 */
export declare type AnyExternalRoutes = {
    [name: string]: ExternalRouteRef;
};
/**
 * Plugin type.
 *
 * @public
 */
export declare type BackstagePlugin<Routes extends AnyRoutes = {}, ExternalRoutes extends AnyExternalRoutes = {}> = {
    getId(): string;
    getApis(): Iterable<AnyApiFactory>;
    /**
     * Returns all registered feature flags for this plugin.
     */
    getFeatureFlags(): Iterable<PluginFeatureFlagConfig>;
    provide<T>(extension: Extension<T>): T;
    routes: Routes;
    externalRoutes: ExternalRoutes;
};
/**
 * Plugin feature flag configuration.
 *
 * @public
 */
export declare type PluginFeatureFlagConfig = {
    /** Feature flag name */
    name: string;
};
/**
 * Plugin descriptor type.
 *
 * @public
 */
export declare type PluginConfig<Routes extends AnyRoutes, ExternalRoutes extends AnyExternalRoutes> = {
    id: string;
    apis?: Iterable<AnyApiFactory>;
    routes?: Routes;
    externalRoutes?: ExternalRoutes;
    featureFlags?: PluginFeatureFlagConfig[];
};
/**
 * Interface for registering feature flags hooks.
 *
 * @public
 */
export declare type FeatureFlagsHooks = {
    register(name: string): void;
};
