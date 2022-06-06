/// <reference types="node" />
import { PluginEndpointDiscovery, PluginCacheManager, TokenManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { PreparerBuilder, GeneratorBuilder, PublisherBase, TechDocsDocument } from '@backstage/plugin-techdocs-node';
export * from '@backstage/plugin-techdocs-node';
export { TechDocsDocument } from '@backstage/plugin-techdocs-node';
import express from 'express';
import { Knex } from 'knex';
import * as winston from 'winston';
import { Logger } from 'winston';
import { Entity } from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/catalog-client';
import { Permission } from '@backstage/plugin-permission-common';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Readable } from 'stream';

/**
 * Parameters passed to the shouldBuild method on the DocsBuildStrategy interface
 *
 * @public
 */
declare type ShouldBuildParameters = {
    entity: Entity;
};
/**
 * A strategy for when to build TechDocs locally, and when to skip building TechDocs (allowing for an external build)
 *
 * @public
 */
interface DocsBuildStrategy {
    shouldBuild(params: ShouldBuildParameters): Promise<boolean>;
}

/**
 * Required dependencies for running TechDocs in the "out-of-the-box"
 * deployment configuration (prepare/generate/publish all in the Backend).
 *
 * @public
 */
declare type OutOfTheBoxDeploymentOptions = {
    preparers: PreparerBuilder;
    generators: GeneratorBuilder;
    publisher: PublisherBase;
    logger: winston.Logger;
    discovery: PluginEndpointDiscovery;
    database?: Knex;
    config: Config;
    cache: PluginCacheManager;
    docsBuildStrategy?: DocsBuildStrategy;
    buildLogTransport?: winston.transport;
};
/**
 * Required dependencies for running TechDocs in the "recommended" deployment
 * configuration (prepare/generate handled externally in CI/CD).
 *
 * @public
 */
declare type RecommendedDeploymentOptions = {
    publisher: PublisherBase;
    logger: winston.Logger;
    discovery: PluginEndpointDiscovery;
    config: Config;
    cache: PluginCacheManager;
    docsBuildStrategy?: DocsBuildStrategy;
    buildLogTransport?: winston.transport;
};
/**
 * One of the two deployment configurations must be provided.
 *
 * @public
 */
declare type RouterOptions = RecommendedDeploymentOptions | OutOfTheBoxDeploymentOptions;
/**
 * Creates a techdocs router.
 *
 * @public
 */
declare function createRouter(options: RouterOptions): Promise<express.Router>;

/**
 * Options to configure the TechDocs collator factory
 *
 * @public
 */
declare type TechDocsCollatorFactoryOptions = {
    discovery: PluginEndpointDiscovery;
    logger: Logger;
    tokenManager: TokenManager;
    locationTemplate?: string;
    catalogClient?: CatalogApi;
    parallelismLimit?: number;
    legacyPathCasing?: boolean;
};
/**
 * A search collator factory responsible for gathering and transforming
 * TechDocs documents.
 *
 * @public
 */
declare class DefaultTechDocsCollatorFactory implements DocumentCollatorFactory {
    readonly type: string;
    readonly visibilityPermission: Permission;
    private discovery;
    private locationTemplate;
    private readonly logger;
    private readonly catalogClient;
    private readonly tokenManager;
    private readonly parallelismLimit;
    private readonly legacyPathCasing;
    private constructor();
    static fromConfig(config: Config, options: TechDocsCollatorFactoryOptions): DefaultTechDocsCollatorFactory;
    getCollator(): Promise<Readable>;
    private execute;
    private applyArgsToFormat;
    private static constructDocsIndexUrl;
    private static handleEntityInfoCasing;
}

/**
 * Options to configure the TechDocs collator
 *
 * @public
 */
declare type TechDocsCollatorOptions = {
    discovery: PluginEndpointDiscovery;
    logger: Logger;
    tokenManager: TokenManager;
    locationTemplate?: string;
    catalogClient?: CatalogApi;
    parallelismLimit?: number;
    legacyPathCasing?: boolean;
};
/**
 * A search collator responsible for gathering and transforming TechDocs documents.
 *
 * @public
 * @deprecated Upgrade to a more recent `@backstage/plugin-search-backend-node` and
 * use `DefaultTechDocsCollatorFactory` instead.
 */
declare class DefaultTechDocsCollator {
    private readonly legacyPathCasing;
    private readonly options;
    readonly type: string;
    readonly visibilityPermission: Permission;
    private constructor();
    static fromConfig(config: Config, options: TechDocsCollatorOptions): DefaultTechDocsCollator;
    execute(): Promise<TechDocsDocument[]>;
    protected applyArgsToFormat(format: string, args: Record<string, string>): string;
    private static constructDocsIndexUrl;
    private static handleEntityInfoCasing;
}

export { DefaultTechDocsCollator, DefaultTechDocsCollatorFactory, DocsBuildStrategy, OutOfTheBoxDeploymentOptions, RecommendedDeploymentOptions, RouterOptions, ShouldBuildParameters, TechDocsCollatorFactoryOptions, TechDocsCollatorOptions, createRouter };
