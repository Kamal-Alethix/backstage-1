/// <reference types="node" />
import { Readable } from 'stream';
import { Logger } from 'winston';
import { PluginCacheManager, PluginEndpointDiscovery, TokenManager, UrlReader } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { AdrDocument, AdrFilePathFilterFn } from '@backstage/plugin-adr-common';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { AdrParser } from './types';
/**
 * Options to configure the AdrCollatorFactory
 * @public
 */
export declare type AdrCollatorFactoryOptions = {
    /**
     * Function used to filter ADR file paths.
     * Defaults to filtering paths following MADR filename format.
     */
    adrFilePathFilterFn?: AdrFilePathFilterFn;
    /**
     * Plugin cache manager
     */
    cache: PluginCacheManager;
    /**
     * App Config
     */
    config: Config;
    /**
     * Catalog API client. Defaults to CatalogClient.
     */
    catalogClient?: CatalogApi;
    /**
     * Plugin Endpoint Discovery client
     */
    discovery: PluginEndpointDiscovery;
    /**
     * Logger
     */
    logger: Logger;
    /**
     * ADR content parser. Defaults to built in MADR parser.
     */
    parser?: AdrParser;
    /**
     * URL Reader
     */
    reader: UrlReader;
    /**
     * Token Manager
     */
    tokenManager: TokenManager;
};
/**
 * Default collator to index ADR documents for Backstage search.
 * @public
 */
export declare class DefaultAdrCollatorFactory implements DocumentCollatorFactory {
    readonly type: string;
    private readonly adrFilePathFilterFn;
    private readonly cacheClient;
    private readonly catalogClient;
    private readonly logger;
    private readonly parser;
    private readonly reader;
    private readonly scmIntegrations;
    private readonly tokenManager;
    private constructor();
    static fromConfig(options: AdrCollatorFactoryOptions): DefaultAdrCollatorFactory;
    getCollator(): Promise<Readable>;
    execute(): AsyncGenerator<AdrDocument>;
}
