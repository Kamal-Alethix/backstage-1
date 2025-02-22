/**
 * Common functionality library for Backstage backends
 *
 * @packageDocumentation
 */

/// <reference types="node" />
/// <reference types="webpack-env" />

import { AbortController as AbortController_2 } from 'node-abort-controller';
import { AbortSignal as AbortSignal_2 } from 'node-abort-controller';
import { AwsS3Integration } from '@backstage/integration';
import { AzureIntegration } from '@backstage/integration';
import { BitbucketCloudIntegration } from '@backstage/integration';
import { BitbucketIntegration } from '@backstage/integration';
import { BitbucketServerIntegration } from '@backstage/integration';
import { Config } from '@backstage/config';
import cors from 'cors';
import Docker from 'dockerode';
import { Duration } from 'luxon';
import { ErrorRequestHandler } from 'express';
import express from 'express';
import { GerritIntegration } from '@backstage/integration';
import { GithubCredentialsProvider } from '@backstage/integration';
import { GitHubIntegration } from '@backstage/integration';
import { GitLabIntegration } from '@backstage/integration';
import { isChildPath } from '@backstage/cli-common';
import { JsonValue } from '@backstage/types';
import { Knex } from 'knex';
import { LoadConfigOptionsRemote } from '@backstage/config-loader';
import { Logger } from 'winston';
import { MergeResult } from 'isomorphic-git';
import { PushResult } from 'isomorphic-git';
import { Readable } from 'stream';
import { ReadCommitResult } from 'isomorphic-git';
import { RequestHandler } from 'express';
import { Router } from 'express';
import { S3 } from 'aws-sdk';
import { Server } from 'http';
import * as winston from 'winston';
import { Writable } from 'stream';

/**
 * Implements a {@link UrlReader} for AWS S3 buckets.
 *
 * @public
 */
export declare class AwsS3UrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: AwsS3Integration, deps: {
        s3: S3;
        treeResponseFactory: ReadTreeResponseFactory;
    });
    /**
     * If accessKeyId and secretAccessKey are missing, the standard credentials provider chain will be used:
     * https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html
     */
    private static buildCredentials;
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(): Promise<SearchResponse>;
    toString(): string;
}

/**
 * Implements a {@link UrlReader} for Azure repos.
 *
 * @public
 */
export declare class AzureUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: AzureIntegration, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
    });
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
}

/**
 * Implements a {@link UrlReader} for files from Bitbucket Cloud.
 *
 * @public
 */
export declare class BitbucketCloudUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: BitbucketCloudIntegration, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
    });
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
    private getLastCommitShortHash;
}

/**
 * Implements a {@link UrlReader} for files from Bitbucket Server APIs.
 *
 * @public
 */
export declare class BitbucketServerUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: BitbucketServerIntegration, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
    });
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
    private getLastCommitShortHash;
}

/**
 * Implements a {@link UrlReader} for files from Bitbucket v1 and v2 APIs, such
 * as the one exposed by Bitbucket Cloud itself.
 *
 * @public
 * @deprecated in favor of BitbucketCloudUrlReader and BitbucketServerUrlReader
 */
export declare class BitbucketUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: BitbucketIntegration, logger: Logger, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
    });
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
    private getLastCommitShortHash;
}

/**
 * A pre-configured, storage agnostic cache client suitable for use by
 * Backstage plugins.
 *
 * @public
 */
export declare interface CacheClient {
    /**
     * Reads data from a cache store for the given key. If no data was found,
     * returns undefined.
     */
    get(key: string): Promise<JsonValue | undefined>;
    /**
     * Writes the given data to a cache store, associated with the given key. An
     * optional TTL may also be provided, otherwise it defaults to the TTL that
     * was provided when the client was instantiated.
     */
    set(key: string, value: JsonValue, options?: CacheClientSetOptions): Promise<void>;
    /**
     * Removes the given key from the cache store.
     */
    delete(key: string): Promise<void>;
}

/**
 * Options given when constructing a {@link CacheClient}.
 *
 * @public
 */
export declare type CacheClientOptions = {
    /**
     * An optional default TTL (in milliseconds) to be set when getting a client
     * instance. If not provided, data will persist indefinitely by default (or
     * can be configured per entry at set-time).
     */
    defaultTtl?: number;
};

/**
 * Options passed to {@link CacheClient.set}.
 *
 * @public
 */
export declare type CacheClientSetOptions = {
    /**
     * Optional TTL in milliseconds. Defaults to the TTL provided when the client
     * was set up (or no TTL if none are provided).
     */
    ttl?: number;
};

/**
 * Implements a Cache Manager which will automatically create new cache clients
 * for plugins when requested. All requested cache clients are created with the
 * connection details provided.
 *
 * @public
 */
export declare class CacheManager {
    /**
     * Keys represent supported `backend.cache.store` values, mapped to factories
     * that return Keyv instances appropriate to the store.
     */
    private readonly storeFactories;
    /**
     * Shared memory store for the in-memory cache client. Sharing the same Map
     * instance ensures get/set/delete operations hit the same store, regardless
     * of where/when a client is instantiated.
     */
    private readonly memoryStore;
    private readonly logger;
    private readonly store;
    private readonly connection;
    private readonly errorHandler;
    /**
     * Creates a new {@link CacheManager} instance by reading from the `backend`
     * config section, specifically the `.cache` key.
     *
     * @param config - The loaded application configuration.
     */
    static fromConfig(config: Config, options?: CacheManagerOptions): CacheManager;
    private constructor();
    /**
     * Generates a PluginCacheManager for consumption by plugins.
     *
     * @param pluginId - The plugin that the cache manager should be created for.
     *        Plugin names should be unique.
     */
    forPlugin(pluginId: string): PluginCacheManager;
    private getClientWithTtl;
    private getRedisClient;
    private getMemcacheClient;
    private getMemoryClient;
    private getNoneClient;
}

/**
 * Options given when constructing a {@link CacheManager}.
 *
 * @public
 */
export declare type CacheManagerOptions = {
    /**
     * An optional logger for use by the PluginCacheManager.
     */
    logger?: Logger;
    /**
     * An optional handler for connection errors emitted from the underlying data
     * store.
     */
    onError?: (err: Error) => void;
};

/**
 * A logging format that adds coloring to console output.
 *
 * @public
 */
export declare const coloredFormat: winston.Logform.Format;

/**
 * Handles the running of containers, on behalf of others.
 *
 * @public
 */
export declare interface ContainerRunner {
    /**
     * Runs a container image to completion.
     */
    runContainer(opts: RunContainerOptions): Promise<void>;
}

/**
 * A context that is meant to be passed as a ctx variable down the call chain,
 * to pass along scoped information and abort signals.
 *
 * @alpha
 */
export declare interface Context {
    /**
     * Returns an abort signal that triggers when the current context or any of
     * its parents signal for it.
     */
    readonly abortSignal: AbortSignal_2;
    /**
     * The point in time when the current context shall time out and abort, if
     * applicable.
     */
    readonly deadline: Date | undefined;
    /**
     * Attempts to get a stored value by key from the context.
     *
     * @param key - The key of the value to get
     * @returns The associated value, or undefined if not set
     */
    value<T = unknown>(key: string): T | undefined;
}

/**
 * Common context decorators.
 *
 * @alpha
 */
export declare class Contexts {
    /**
     * Creates a root context.
     *
     * @remarks
     *
     * This should normally only be called near the root of an application. The
     * created context is meant to be passed down into deeper levels, which may or
     * may not make derived contexts out of it.
     */
    static root(): Context;
    /**
     * Creates a derived context, which signals to abort operations either when
     * any parent context signals, or when the given source is aborted.
     *
     * @remarks
     *
     * If the parent context was already aborted, then it is returned as-is.
     *
     * If the given source was already aborted, then a new already-aborted context
     * is returned.
     *
     * @param parentCtx - A parent context that shall be used as a base
     * @param source - An abort controller or signal that you intend to perhaps
     *                 trigger at some later point in time.
     * @returns A new {@link Context}
     */
    static withAbort(parentCtx: Context, source: AbortController_2 | AbortSignal_2): Context;
    /**
     * Creates a derived context, which signals to abort operations either when
     * any parent context signals, or when the given amount of time has passed.
     * This may affect the deadline.
     *
     * @param parentCtx - A parent context that shall be used as a base
     * @param timeout - The duration of time, after which the derived context will
     *                  signal to abort.
     * @returns A new {@link Context}
     */
    static withTimeoutDuration(parentCtx: Context, timeout: Duration): Context;
    /**
     * Creates a derived context, which signals to abort operations either when
     * any parent context signals, or when the given amount of time has passed.
     * This may affect the deadline.
     *
     * @param parentCtx - A parent context that shall be used as a base
     * @param timeout - The number of milliseconds, after which the derived
     *                  context will signal to abort.
     * @returns A new {@link Context}
     */
    static withTimeoutMillis(parentCtx: Context, timeout: number): Context;
    /**
     * Creates a derived context, which has a specific key-value pair set as well
     * as all key-value pairs that were set in the original context.
     *
     * @param parentCtx - A parent context that shall be used as a base
     * @param key - The key of the value to set
     * @param value - The value, or a function that accepts the previous value (or
     *                undefined if not set yet) and computes the new value
     * @returns A new {@link Context}
     */
    static withValue(parentCtx: Context, key: string, value: unknown | ((previous: unknown | undefined) => unknown)): Context;
}

/**
 * Creates a knex database connection
 *
 * @public
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export declare function createDatabaseClient(dbConfig: Config, overrides?: Partial<Knex.Config>): Knex<any, any[]>;

/**
 * Creates a default "root" logger. This also calls {@link setRootLogger} under
 * the hood.
 *
 * @remarks
 *
 * This is the logger instance that will be the foundation for all other logger
 * instances passed to plugins etc, in a given backend.
 *
 * @public
 */
export declare function createRootLogger(options?: winston.LoggerOptions, env?: NodeJS.ProcessEnv): winston.Logger;

/**
 * Creates a new service builder.
 *
 * @public
 */
export declare function createServiceBuilder(_module: NodeModule): ServiceBuilder;

/**
 * Creates a default status checking router, that you can add to your express
 * app.
 *
 * @remarks
 *
 * This adds a `/healthcheck` route (or any other path, if given as an
 * argument), which your infra can call to see if the service is ready to serve
 * requests.
 *
 * @public
 */
export declare function createStatusCheckRouter(options: {
    logger: Logger;
    /**
     * The path (including a leading slash) that the health check should be
     * mounted on.
     *
     * @defaultValue '/healthcheck'
     */
    path?: string;
    /**
     * If not implemented, the default express middleware always returns 200.
     * Override this to implement your own logic for a health check.
     */
    statusCheck?: StatusCheck;
}): Promise<express.Router>;

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

/**
 * Creation options for {@link DatabaseManager}.
 *
 * @public
 */
export declare type DatabaseManagerOptions = {
    migrations?: PluginDatabaseManager['migrations'];
};

/**
 * A {@link ContainerRunner} for Docker containers.
 *
 * @public
 */
export declare class DockerContainerRunner implements ContainerRunner {
    private readonly dockerClient;
    constructor(options: {
        dockerClient: Docker;
    });
    runContainer(options: RunContainerOptions): Promise<void>;
}

/**
 * Ensures that the given databases all exist, creating them if they do not.
 *
 * @public
 */
export declare function ensureDatabaseExists(dbConfig: Config, ...databases: Array<string>): Promise<void>;

/**
 * Express middleware to handle errors during request processing.
 *
 * This is commonly the very last middleware in the chain.
 *
 * Its primary purpose is not to do translation of business logic exceptions,
 * but rather to be a global catch-all for uncaught "fatal" errors that are
 * expected to result in a 500 error. However, it also does handle some common
 * error types (such as http-error exceptions) and returns the enclosed status
 * code accordingly.
 *
 * @public
 * @returns An Express error request handler
 */
export declare function errorHandler(options?: ErrorHandlerOptions): ErrorRequestHandler;

/**
 * Options passed to the {@link errorHandler} middleware.
 *
 * @public
 */
export declare type ErrorHandlerOptions = {
    /**
     * Whether error response bodies should show error stack traces or not.
     *
     * If not specified, by default shows stack traces only in development mode.
     */
    showStackTraces?: boolean;
    /**
     * Logger instance to log errors.
     *
     * If not specified, the root logger will be used.
     */
    logger?: Logger;
    /**
     * Whether any 4xx errors should be logged or not.
     *
     * If not specified, default to only logging 5xx errors.
     */
    logClientErrors?: boolean;
};

/**
 * A {@link UrlReader} that does a plain fetch of the URL.
 *
 * @public
 */
export declare class FetchUrlReader implements UrlReader {
    /**
     * The factory creates a single reader that will be used for reading any URL that's listed
     * in configuration at `backend.reading.allow`. The allow list contains a list of objects describing
     * targets to allow, containing the following fields:
     *
     * `host`:
     *   Either full hostnames to match, or subdomain wildcard matchers with a leading `*`.
     *   For example `example.com` and `*.example.com` are valid values, `prod.*.example.com` is not.
     *
     * `paths`:
     *   An optional list of paths which are allowed. If the list is omitted all paths are allowed.
     */
    static factory: ReaderFactory;
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(): Promise<ReadTreeResponse>;
    search(): Promise<SearchResponse>;
    toString(): string;
}

/**
 * Options that control {@link ReadTreeResponseFactory.fromReadableArray}
 * execution.
 *
 * @public
 */
export declare type FromReadableArrayOptions = Array<{
    /**
     * The raw data itself.
     */
    data: Readable;
    /**
     * The filepath of the data.
     */
    path: string;
}>;

/**
 * Implements a {@link UrlReader} for files in Gerrit.
 *
 * @remarks
 * To be able to link to Git contents for Gerrit providers in a user friendly
 * way we are depending on that there is a Gitiles installation somewhere
 * that we can link to. It is perfectly possible to integrate Gerrit with
 * Backstage without Gitiles since all API calls goes directly to Gerrit.
 *
 * The "host" variable in the config is the Gerrit host. The address where
 * Gitiles is installed may be on the same host but it could be on a
 * separate host. For example a Gerrit instance could be hosted on
 * "gerrit-review.company.com" but the repos could be browsable on a separate
 * host, e.g. "gerrit.company.com" and the human readable URL would then
 * not point to the API host.
 *
 * @public
 */
export declare class GerritUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    private readonly workDir;
    static factory: ReaderFactory;
    constructor(integration: GerritIntegration, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
    }, workDir: string);
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(): Promise<SearchResponse>;
    toString(): string;
}

/**
 * Gets the current root logger.
 *
 * @public
 */
export declare function getRootLogger(): winston.Logger;

/**
 * A logger that just throws away all messages.
 *
 * @public
 */
export declare function getVoidLogger(): winston.Logger;

/**
 * A convenience wrapper around the `isomorphic-git` library.
 *
 * @public
 */
export declare class Git {
    private readonly config;
    private constructor();
    add(options: {
        dir: string;
        filepath: string;
    }): Promise<void>;
    addRemote(options: {
        dir: string;
        remote: string;
        url: string;
    }): Promise<void>;
    commit(options: {
        dir: string;
        message: string;
        author: {
            name: string;
            email: string;
        };
        committer: {
            name: string;
            email: string;
        };
    }): Promise<string>;
    /** https://isomorphic-git.org/docs/en/clone */
    clone(options: {
        url: string;
        dir: string;
        ref?: string;
        depth?: number;
        noCheckout?: boolean;
    }): Promise<void>;
    /** https://isomorphic-git.org/docs/en/currentBranch */
    currentBranch(options: {
        dir: string;
        fullName?: boolean;
    }): Promise<string | undefined>;
    /** https://isomorphic-git.org/docs/en/fetch */
    fetch(options: {
        dir: string;
        remote?: string;
    }): Promise<void>;
    init(options: {
        dir: string;
        defaultBranch?: string;
    }): Promise<void>;
    /** https://isomorphic-git.org/docs/en/merge */
    merge(options: {
        dir: string;
        theirs: string;
        ours?: string;
        author: {
            name: string;
            email: string;
        };
        committer: {
            name: string;
            email: string;
        };
    }): Promise<MergeResult>;
    push(options: {
        dir: string;
        remote: string;
    }): Promise<PushResult>;
    /** https://isomorphic-git.org/docs/en/readCommit */
    readCommit(options: {
        dir: string;
        sha: string;
    }): Promise<ReadCommitResult>;
    /** https://isomorphic-git.org/docs/en/resolveRef */
    resolveRef(options: {
        dir: string;
        ref: string;
    }): Promise<string>;
    /** https://isomorphic-git.org/docs/en/log */
    log(options: {
        dir: string;
        ref?: string;
    }): Promise<ReadCommitResult[]>;
    private onAuth;
    private onProgressHandler;
    static fromAuth: (options: {
        username?: string;
        password?: string;
        logger?: Logger;
    }) => Git;
}

/**
 * Implements a {@link UrlReader} for files through the GitHub v3 APIs, such as
 * the one exposed by GitHub itself.
 *
 * @public
 */
export declare class GithubUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: GitHubIntegration, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
        credentialsProvider: GithubCredentialsProvider;
    });
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
    private doReadTree;
    private doSearch;
    private getRepoDetails;
    private fetchResponse;
    private fetchJson;
}

/**
 * Implements a {@link UrlReader} for files on GitLab.
 *
 * @public
 */
export declare class GitlabUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: GitLabIntegration, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
    });
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
}

export { isChildPath }

/**
 * Tries to deduce whether a thrown error is a database conflict.
 *
 * @public
 * @param e - A thrown error
 * @returns True if the error looks like it was a conflict error thrown by a
 *          known database engine
 */
export declare function isDatabaseConflictError(e: unknown): boolean;

/**
 * Load configuration for a Backend.
 *
 * This function should only be called once, during the initialization of the backend.
 *
 * @public
 */
export declare function loadBackendConfig(options: {
    logger: Logger;
    remote?: LoadConfigOptionsRemote;
    argv: string[];
}): Promise<Config>;

/**
 * Express middleware to handle requests for missing routes.
 *
 * Should be used as the very last handler in the chain, as it unconditionally
 * returns a 404 status.
 *
 * @public
 * @returns An Express request handler
 */
export declare function notFoundHandler(): RequestHandler;

/**
 * Manages access to cache stores that plugins get.
 *
 * @public
 */
export declare type PluginCacheManager = {
    /**
     * Provides backend plugins cache connections for themselves.
     *
     * @remarks
     *
     * The purpose of this method is to allow plugins to get isolated data stores
     * so that plugins are discouraged from cache-level integration and/or cache
     * key collisions.
     */
    getClient: (options?: CacheClientOptions) => CacheClient;
};

/**
 * The PluginDatabaseManager manages access to databases that Plugins get.
 *
 * @public
 */
export declare interface PluginDatabaseManager {
    /**
     * getClient provides backend plugins database connections for itself.
     *
     * The purpose of this method is to allow plugins to get isolated data
     * stores so that plugins are discouraged from database integration.
     */
    getClient(): Promise<Knex>;
    /**
     * This property is used to control the behavior of database migrations.
     */
    migrations?: {
        /**
         * skip database migrations. Useful if connecting to a read-only database.
         *
         * @defaultValue false
         */
        skip?: boolean;
    };
}

/**
 * The PluginEndpointDiscovery is used to provide a mechanism for backend
 * plugins to discover the endpoints for itself or other backend plugins.
 *
 * The purpose of the discovery API is to allow for many different deployment
 * setups and routing methods through a central configuration, instead
 * of letting each individual plugin manage that configuration.
 *
 * Implementations of the discovery API can be as simple as a URL pattern
 * using the pluginId, but could also have overrides for individual plugins,
 * or query a separate discovery service.
 *
 * @public
 */
export declare type PluginEndpointDiscovery = {
    /**
     * Returns the internal HTTP base URL for a given plugin, without a trailing slash.
     *
     * The returned URL should point to an internal endpoint for the plugin, with
     * the shortest route possible. The URL should be used for service-to-service
     * communication within a Backstage backend deployment.
     *
     * This method must always be called just before making a request, as opposed to
     * fetching the URL when constructing an API client. That is to ensure that more
     * flexible routing patterns can be supported.
     *
     * For example, asking for the URL for `catalog` may return something
     * like `http://10.1.2.3/api/catalog`
     */
    getBaseUrl(pluginId: string): Promise<string>;
    /**
     * Returns the external HTTP base backend URL for a given plugin, without a trailing slash.
     *
     * The returned URL should point to an external endpoint for the plugin, such that
     * it is reachable from the Backstage frontend and other external services. The returned
     * URL should be usable for example as a callback / webhook URL.
     *
     * The returned URL should be stable and in general not change unless other static
     * or external configuration is changed. Changes should not come as a surprise
     * to an operator of the Backstage backend.
     *
     * For example, asking for the URL for `catalog` may return something
     * like `https://backstage.example.com/api/catalog`
     */
    getExternalBaseUrl(pluginId: string): Promise<string>;
};

/**
 * A factory function that can read config to construct zero or more
 * {@link UrlReader}s along with a predicate for when it should be used.
 *
 * @public
 */
export declare type ReaderFactory = (options: {
    config: Config;
    logger: Logger;
    treeResponseFactory: ReadTreeResponseFactory;
}) => UrlReaderPredicateTuple[];

/**
 * An options object for {@link UrlReader.readTree} operations.
 *
 * @public
 */
export declare type ReadTreeOptions = {
    /**
     * A filter that can be used to select which files should be included.
     *
     * @remarks
     *
     * The path passed to the filter function is the relative path from the URL
     * that the file tree is fetched from, without any leading '/'.
     *
     * For example, given the URL https://github.com/my/repo/tree/master/my-dir, a file
     * at https://github.com/my/repo/blob/master/my-dir/my-subdir/my-file.txt will
     * be represented as my-subdir/my-file.txt
     *
     * If no filter is provided, all files are extracted.
     */
    filter?(path: string, info?: {
        size: number;
    }): boolean;
    /**
     * An ETag which can be provided to check whether a
     * {@link UrlReader.readTree} response has changed from a previous execution.
     *
     * @remarks
     *
     * In the {@link UrlReader.readTree} response, an ETag is returned along with
     * the tree blob. The ETag is a unique identifier of the tree blob, usually
     * the commit SHA or ETag from the target.
     *
     * When an ETag is given as a request option, {@link UrlReader.readTree} will
     * first compare the ETag against the ETag on the target branch. If they
     * match, {@link UrlReader.readTree} will throw a
     * {@link @backstage/errors#NotModifiedError} indicating that the response
     * will not differ from the previous response which included this particular
     * ETag. If they do not match, {@link UrlReader.readTree} will return the
     * rest of the response along with a new ETag.
     */
    etag?: string;
    /**
     * An abort signal to pass down to the underlying request.
     *
     * @remarks
     *
     * Not all reader implementations may take this field into account.
     */
    signal?: AbortSignal_2;
};

/**
 * A response object for {@link UrlReader.readTree} operations.
 *
 * @public
 */
export declare type ReadTreeResponse = {
    /**
     * Returns an array of all the files inside the tree, and corresponding
     * functions to read their content.
     */
    files(): Promise<ReadTreeResponseFile[]>;
    /**
     * Returns the tree contents as a binary archive, using a stream.
     */
    archive(): Promise<NodeJS.ReadableStream>;
    /**
     * Extracts the tree response into a directory and returns the path of the
     * directory.
     *
     * **NOTE**: It is the responsibility of the caller to remove the directory after use.
     */
    dir(options?: ReadTreeResponseDirOptions): Promise<string>;
    /**
     * Etag returned by content provider.
     *
     * @remarks
     *
     * Can be used to compare and cache responses when doing subsequent calls.
     */
    etag: string;
};

/**
 * Options that control {@link ReadTreeResponse.dir} execution.
 *
 * @public
 */
export declare type ReadTreeResponseDirOptions = {
    /**
     * The directory to write files to.
     *
     * @remarks
     *
     * Defaults to the OS tmpdir, or `backend.workingDirectory` if set in config.
     */
    targetDir?: string;
};

/**
 * A factory for response factories that handle the unpacking and inspection of
 * complex responses such as archive data.
 *
 * @public
 */
export declare interface ReadTreeResponseFactory {
    fromTarArchive(options: ReadTreeResponseFactoryOptions): Promise<ReadTreeResponse>;
    fromZipArchive(options: ReadTreeResponseFactoryOptions): Promise<ReadTreeResponse>;
    fromReadableArray(options: FromReadableArrayOptions): Promise<ReadTreeResponse>;
}

/**
 * Options that control execution of {@link ReadTreeResponseFactory} methods.
 *
 * @public
 */
export declare type ReadTreeResponseFactoryOptions = {
    stream: Readable;
    subpath?: string;
    etag: string;
    filter?: (path: string, info?: {
        size: number;
    }) => boolean;
};

/**
 * Represents a single file in a {@link UrlReader.readTree} response.
 *
 * @public
 */
export declare type ReadTreeResponseFile = {
    path: string;
    content(): Promise<Buffer>;
};

/**
 * An options object for readUrl operations.
 *
 * @public
 */
export declare type ReadUrlOptions = {
    /**
     * An ETag which can be provided to check whether a
     * {@link UrlReader.readUrl} response has changed from a previous execution.
     *
     * @remarks
     *
     * In the {@link UrlReader.readUrl} response, an ETag is returned along with
     * the data. The ETag is a unique identifier of the data, usually the commit
     * SHA or ETag from the target.
     *
     * When an ETag is given in ReadUrlOptions, {@link UrlReader.readUrl} will
     * first compare the ETag against the ETag of the target. If they match,
     * {@link UrlReader.readUrl} will throw a
     * {@link @backstage/errors#NotModifiedError} indicating that the response
     * will not differ from the previous response which included this particular
     * ETag. If they do not match, {@link UrlReader.readUrl} will return the rest
     * of the response along with a new ETag.
     */
    etag?: string;
    /**
     * An abort signal to pass down to the underlying request.
     *
     * @remarks
     *
     * Not all reader implementations may take this field into account.
     */
    signal?: AbortSignal_2;
};

/**
 * A response object for {@link UrlReader.readUrl} operations.
 *
 * @public
 */
export declare type ReadUrlResponse = {
    /**
     * Returns the data that was read from the remote URL.
     */
    buffer(): Promise<Buffer>;
    /**
     * Returns the data that was read from the remote URL as a Readable stream.
     *
     * @remarks
     *
     * This method will be required in a future release.
     */
    stream?(): Readable;
    /**
     * Etag returned by content provider.
     *
     * @remarks
     *
     * Can be used to compare and cache responses when doing subsequent calls.
     */
    etag?: string;
};

/**
 * Utility class for UrlReader implementations to create valid ReadUrlResponse
 * instances from common response primitives.
 *
 * @public
 */
export declare class ReadUrlResponseFactory {
    /**
     * Resolves a ReadUrlResponse from a Readable stream.
     */
    static fromReadable(stream: Readable, options?: ReadUrlResponseFactoryFromStreamOptions): Promise<ReadUrlResponse>;
    /**
     * Resolves a ReadUrlResponse from an old-style NodeJS.ReadableStream.
     */
    static fromNodeJSReadable(oldStyleStream: NodeJS.ReadableStream, options?: ReadUrlResponseFactoryFromStreamOptions): Promise<ReadUrlResponse>;
}

/**
 * An options object for {@link ReadUrlResponseFactory} factory methods.
 *
 * @public
 */
export declare type ReadUrlResponseFactoryFromStreamOptions = {
    etag?: string;
};

/**
 * Logs incoming requests.
 *
 * @public
 * @param logger - An optional logger to use. If not specified, the root logger will be used.
 * @returns An Express request handler
 */
export declare function requestLoggingHandler(logger?: Logger): RequestHandler;

/**
 * A factory for request loggers.
 *
 * @public
 */
export declare type RequestLoggingHandlerFactory = (logger?: Logger) => RequestHandler;

/**
 * Resolve a path relative to the root of a package directory.
 * Additional path arguments are resolved relative to the package dir.
 *
 * This is particularly useful when you want to access assets shipped with
 * your backend plugin package. When doing so, do not forget to include the assets
 * in your published package by adding them to `files` in your `package.json`.
 *
 * @public
 */
export declare function resolvePackagePath(name: string, ...paths: string[]): string;

/**
 * Resolves a target path from a base path while guaranteeing that the result is
 * a path that point to or within the base path. This is useful for resolving
 * paths from user input, as it otherwise opens up for vulnerabilities.
 *
 * @public
 * @param base - The base directory to resolve the path from.
 * @param path - The target path, relative or absolute
 * @returns A path that is guaranteed to point to or within the base path.
 */
export declare function resolveSafeChildPath(base: string, path: string): string;

/**
 * Options passed to the {@link ContainerRunner.runContainer} method.
 *
 * @public
 */
export declare type RunContainerOptions = {
    imageName: string;
    command?: string | string[];
    args: string[];
    logStream?: Writable;
    mountDirs?: Record<string, string>;
    workingDir?: string;
    envVars?: Record<string, string>;
    pullImage?: boolean;
};

/**
 * An options object for search operations.
 *
 * @public
 */
export declare type SearchOptions = {
    /**
     * An etag can be provided to check whether the search response has changed from a previous execution.
     *
     * In the search() response, an etag is returned along with the files. The etag is a unique identifier
     * of the current tree, usually the commit SHA or etag from the target.
     *
     * When an etag is given in SearchOptions, search will first compare the etag against the etag
     * on the target branch. If they match, search will throw a NotModifiedError indicating that the search
     * response will not differ from the previous response which included this particular etag. If they mismatch,
     * search will return the rest of SearchResponse along with a new etag.
     */
    etag?: string;
    /**
     * An abort signal to pass down to the underlying request.
     *
     * @remarks
     *
     * Not all reader implementations may take this field into account.
     */
    signal?: AbortSignal_2;
};

/**
 * The output of a search operation.
 *
 * @public
 */
export declare type SearchResponse = {
    /**
     * The files that matched the search query.
     */
    files: SearchResponseFile[];
    /**
     * A unique identifier of the current remote tree, usually the commit SHA or etag from the target.
     */
    etag: string;
};

/**
 * Represents a single file in a search response.
 *
 * @public
 */
export declare type SearchResponseFile = {
    /**
     * The full URL to the file.
     */
    url: string;
    /**
     * The binary contents of the file.
     */
    content(): Promise<Buffer>;
};

/**
 * Creates and validates tokens for use during backend-to-backend
 * authentication.
 *
 * @public
 */
export declare class ServerTokenManager implements TokenManager {
    private readonly options;
    private readonly verificationKeys;
    private signingKey;
    private privateKeyPromise;
    private currentTokenPromise;
    /**
     * Creates a token manager that issues static dummy tokens and never fails
     * authentication. This can be useful for testing.
     */
    static noop(): TokenManager;
    static fromConfig(config: Config, options: ServerTokenManagerOptions): ServerTokenManager;
    private constructor();
    private generateKeys;
    getToken(): Promise<{
        token: string;
    }>;
    authenticate(token: string): Promise<void>;
}

/**
 * Options for {@link ServerTokenManager}.
 *
 * @public
 */
export declare interface ServerTokenManagerOptions {
    /**
     * The logger to use.
     */
    logger: Logger;
}

/**
 * A helper for building backend service instances.
 *
 * @public
 */
export declare type ServiceBuilder = {
    /**
     * Sets the service parameters based on configuration.
     *
     * @param config - The configuration to read
     */
    loadConfig(config: Config): ServiceBuilder;
    /**
     * Sets the port to listen on.
     *
     * If no port is specified, the service will first look for an environment
     * variable named PORT and use that if present, otherwise it picks a default
     * port (7007).
     *
     * @param port - The port to listen on
     */
    setPort(port: number): ServiceBuilder;
    /**
     * Sets the host to listen on.
     *
     * '' is express default, which listens to all interfaces.
     *
     * @param host - The host to listen on
     */
    setHost(host: string): ServiceBuilder;
    /**
     * Sets the logger to use for service-specific logging.
     *
     * If no logger is given, the default root logger is used.
     *
     * @param logger - A winston logger
     */
    setLogger(logger: Logger): ServiceBuilder;
    /**
     * Enables CORS handling using the given settings.
     *
     * If this method is not called, the resulting service will not have any
     * built in CORS handling.
     *
     * @param options - Standard CORS options
     */
    enableCors(options: cors.CorsOptions): ServiceBuilder;
    /**
     * Configure self-signed certificate generation options.
     *
     * If this method is not called, the resulting service will use sensible defaults
     *
     * @param options - Standard certificate options
     */
    setHttpsSettings(settings: {
        certificate: {
            key: string;
            cert: string;
        } | {
            hostname: string;
        };
    }): ServiceBuilder;
    /**
     * Adds a router (similar to the express .use call) to the service.
     *
     * @param root - The root URL to bind to (e.g. "/api/function1")
     * @param router - An express router
     */
    addRouter(root: string, router: Router | RequestHandler): ServiceBuilder;
    /**
     * Set the request logging handler
     *
     * If no handler is given the default one is used
     *
     * @param requestLoggingHandler - a factory function that given a logger returns an handler
     */
    setRequestLoggingHandler(requestLoggingHandler: RequestLoggingHandlerFactory): ServiceBuilder;
    /**
     * Sets an additional errorHandler to run before the defaultErrorHandler.
     *
     * For execution of only the custom error handler make sure to also invoke disableDefaultErrorHandler()
     * otherwise the defaultErrorHandler is executed at the end of the error middleware chain.
     *
     * @param errorHandler - an error handler
     */
    setErrorHandler(errorHandler: ErrorRequestHandler): ServiceBuilder;
    /**
     * Disables the default error handler
     */
    disableDefaultErrorHandler(): ServiceBuilder;
    /**
     * Starts the server using the given settings.
     */
    start(): Promise<Server>;
};

/**
 * Sets a completely custom default "root" logger.
 *
 * @remarks
 *
 * This is the logger instance that will be the foundation for all other logger
 * instances passed to plugins etc, in a given backend.
 *
 * Only use this if you absolutely need to make a completely custom logger.
 * Normally if you want to make light adaptations to the default logger
 * behavior, you would instead call {@link createRootLogger}.
 *
 * @public
 */
export declare function setRootLogger(newLogger: winston.Logger): void;

/**
 * SingleHostDiscovery is a basic PluginEndpointDiscovery implementation
 * that assumes that all plugins are hosted in a single deployment.
 *
 * The deployment may be scaled horizontally, as long as the external URL
 * is the same for all instances. However, internal URLs will always be
 * resolved to the same host, so there won't be any balancing of internal traffic.
 *
 * @public
 */
export declare class SingleHostDiscovery implements PluginEndpointDiscovery {
    private readonly internalBaseUrl;
    private readonly externalBaseUrl;
    /**
     * Creates a new SingleHostDiscovery discovery instance by reading
     * from the `backend` config section, specifically the `.baseUrl` for
     * discovering the external URL, and the `.listen` and `.https` config
     * for the internal one.
     *
     * The basePath defaults to `/api`, meaning the default full internal
     * path for the `catalog` plugin will be `http://localhost:7007/api/catalog`.
     */
    static fromConfig(config: Config, options?: {
        basePath?: string;
    }): SingleHostDiscovery;
    private constructor();
    getBaseUrl(pluginId: string): Promise<string>;
    getExternalBaseUrl(pluginId: string): Promise<string>;
}

/**
 * A custom status checking function, passed to {@link statusCheckHandler} and
 * {@link createStatusCheckRouter}.
 *
 * @public
 */
export declare type StatusCheck = () => Promise<any>;

/**
 * Express middleware for status checks.
 *
 * This is commonly used to implement healthcheck and readiness routes.
 *
 * @public
 * @param options - An optional configuration object.
 * @returns An Express error request handler
 */
export declare function statusCheckHandler(options?: StatusCheckHandlerOptions): Promise<RequestHandler>;

/**
 * Options passed to {@link statusCheckHandler}.
 *
 * @public
 */
export declare interface StatusCheckHandlerOptions {
    /**
     * Optional status function which returns a message.
     */
    statusCheck?: StatusCheck;
}

/**
 * Interface for creating and validating tokens.
 *
 * @public
 */
export declare interface TokenManager {
    /**
     * Fetches a valid token.
     *
     * @remarks
     *
     * Tokens are valid for roughly one hour; the actual deadline is set in the
     * payload `exp` claim. Never hold on to tokens for reuse; always ask for a
     * new one for each outgoing request. This ensures that you always get a
     * valid, fresh one.
     */
    getToken(): Promise<{
        token: string;
    }>;
    /**
     * Validates a given token.
     */
    authenticate(token: string): Promise<void>;
}

/**
 * A generic interface for fetching plain data from URLs.
 *
 * @public
 */
export declare type UrlReader = {
    /**
     * Reads a single file and return its content.
     */
    read(url: string): Promise<Buffer>;
    /**
     * Reads a single file and return its content.
     *
     * @remarks
     *
     * This is a replacement for the read method that supports options and
     * complex responses.
     *
     * Use this whenever it is available, as the read method will be
     * deprecated and eventually removed in a future release.
     */
    readUrl?(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    /**
     * Reads a full or partial file tree.
     */
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    /**
     * Searches for a file in a tree using a glob pattern.
     */
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
};

/**
 * A predicate that decides whether a specific {@link UrlReader} can handle a
 * given URL.
 *
 * @public
 */
export declare type UrlReaderPredicateTuple = {
    predicate: (url: URL) => boolean;
    reader: UrlReader;
};

/**
 * Helps construct {@link UrlReader}s.
 *
 * @public
 */
export declare class UrlReaders {
    /**
     * Creates a custom {@link UrlReader} wrapper for your own set of factories.
     */
    static create(options: UrlReadersOptions): UrlReader;
    /**
     * Creates a {@link UrlReader} wrapper that includes all the default factories
     * from this package.
     *
     * Any additional factories passed will be loaded before the default ones.
     */
    static default(options: UrlReadersOptions): UrlReader;
}

/**
 * Creation options for {@link UrlReaders}.
 *
 * @public
 */
export declare type UrlReadersOptions = {
    /** Root config object */
    config: Config;
    /** Logger used by all the readers */
    logger: Logger;
    /** A list of factories used to construct individual readers that match on URLs */
    factories?: ReaderFactory[];
};

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

export { }
