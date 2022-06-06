import { PluginConfig, BackstagePlugin, AnyRoutes, AnyExternalRoutes } from './types';
/**
 * Creates Backstage Plugin from config.
 *
 * @param config - Plugin configuration.
 * @public
 */
export declare function createPlugin<Routes extends AnyRoutes = {}, ExternalRoutes extends AnyExternalRoutes = {}>(config: PluginConfig<Routes, ExternalRoutes>): BackstagePlugin<Routes, ExternalRoutes>;
