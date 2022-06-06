import { Config } from '@backstage/config';
import { PluginDatabaseManager } from './types';
/**
 * Creation options for {@link DatabaseManager}.
 *
 * @public
 */
export declare type DatabaseManagerOptions = {
    migrations?: PluginDatabaseManager['migrations'];
};
/**
 * Manages database connections for Backstage backend plugins.
 *
 * The database manager allows the user to set connection and client settings on
 * a per pluginId basis by defining a database config block under
 * `plugin.<pluginId>` in addition to top level defaults. Optionally, a user may
 * set `prefix` which is used to prefix generated database names if config is
 * not provided.
 *
 * @public
 */
export declare class DatabaseManager {
    private readonly config;
    private readonly prefix;
    private readonly options?;
    /**
     * Creates a {@link DatabaseManager} from `backend.database` config.
     *
     * @param config - The loaded application configuration.
     * @param options - An optional configuration object.
     */
    static fromConfig(config: Config, options?: DatabaseManagerOptions): DatabaseManager;
    private constructor();
    /**
     * Generates a PluginDatabaseManager for consumption by plugins.
     *
     * @param pluginId - The plugin that the database manager should be created for. Plugin names
     * should be unique as they are used to look up database config overrides under
     * `backend.database.plugin`.
     */
    forPlugin(pluginId: string): PluginDatabaseManager;
    /**
     * Provides the canonical database name for a given plugin.
     *
     * This method provides the effective database name which is determined using global
     * and plugin specific database config. If no explicit database name is configured
     * and `pluginDivisionMode` is not `schema`, this method will provide a generated name
     * which is the pluginId prefixed with 'backstage_plugin_'. If `pluginDivisionMode` is
     * `schema`, it will fallback to using the default database for the knex instance.
     *
     * @param pluginId - Lookup the database name for given plugin
     * @returns String representing the plugin's database name
     */
    private getDatabaseName;
    /**
     * Provides the client type which should be used for a given plugin.
     *
     * The client type is determined by plugin specific config if present.
     * Otherwise the base client is used as the fallback.
     *
     * @param pluginId - Plugin to get the client type for
     * @returns Object with client type returned as `client` and boolean
     *          representing whether or not the client was overridden as
     *          `overridden`
     */
    private getClientType;
    /**
     * Provides the knexConfig which should be used for a given plugin.
     *
     * @param pluginId - Plugin to get the knexConfig for
     * @returns The merged knexConfig value or undefined if it isn't specified
     */
    private getAdditionalKnexConfig;
    private getEnsureExistsConfig;
    private getPluginDivisionModeConfig;
    /**
     * Provides a Knex connection plugin config by combining base and plugin
     * config.
     *
     * This method provides a baseConfig for a plugin database connector. If the
     * client type has not been overridden, the global connection config will be
     * included with plugin specific config as the base. Values from the plugin
     * connection take precedence over the base. Base database name is omitted for
     * all supported databases excluding SQLite unless `pluginDivisionMode` is set
     * to `schema`.
     */
    private getConnectionConfig;
    /**
     * Provides a Knex database config for a given plugin.
     *
     * This method provides a Knex configuration object along with the plugin's
     * client type.
     *
     * @param pluginId - The plugin that the database config should correspond with
     */
    private getConfigForPlugin;
    /**
     * Provides a partial `Knex.Config` database schema override for a given
     * plugin.
     *
     * @param pluginId - Target plugin to get database schema override
     * @returns Partial `Knex.Config` with database schema override
     */
    private getSchemaOverrides;
    /**
     * Provides a partial `Knex.Config`• database name override for a given plugin.
     *
     * @param pluginId - Target plugin to get database name override
     * @returns Partial `Knex.Config` with database name override
     */
    private getDatabaseOverrides;
    /**
     * Provides a scoped Knex client for a plugin as per application config.
     *
     * @param pluginId - Plugin to get a Knex client for
     * @returns Promise which resolves to a scoped Knex database client for a
     *          plugin
     */
    private getDatabase;
}
