/// <reference types="node" />
import { Readable } from 'stream';
import { Logger } from 'winston';
import { PluginCacheManager, PluginEndpointDiscovery, UrlReader, TokenManager } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { AdrDocument, AdrFilePathFilterFn } from '@backstage/plugin-adr-common';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Entity } from '@backstage/catalog-model';

/**
 * Context passed to a AdrParser.
 * @public
 */
declare type AdrParserContext = {
    /**
     * The entity associated with the ADR.
     */
    entity: Entity;
    /**
     * The ADR content string.
     */
    content: string;
    /**
     * The ADR file path.
     */
    path: string;
};
/**
 * ADR parser function type.
 * @public
 */
declare type AdrParser = (ctx: AdrParserContext) => Promise<AdrDocument>;

/**
 * Options to configure the AdrCollatorFactory
 * @public
 */
declare type AdrCollatorFactoryOptions = {
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
declare class DefaultAdrCollatorFactory implements DocumentCollatorFactory {
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

/**
 *
 * Options for the default MADR content parser
 * @public
 */
declare type MadrParserOptions = {
    /**
     * Location template for the route of the frontend plugin
     * Defaults to '/catalog/:namespace/:kind/:name/adrs?record=:record'
     */
    locationTemplate?: string;
    /**
     * luxon DateTime format string to parse ADR dates with.
     * Defaults to 'yyyy-MM-dd'
     */
    dateFormat?: string;
};
/**
 * Default content parser for ADRs following the MADR template (https://adr.github.io/madr/)
 * @public
 */
declare const createMadrParser: (options?: MadrParserOptions) => AdrParser;

export { AdrCollatorFactoryOptions, AdrParser, AdrParserContext, DefaultAdrCollatorFactory, MadrParserOptions, createMadrParser };
