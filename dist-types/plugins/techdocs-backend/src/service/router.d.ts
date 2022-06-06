import { PluginEndpointDiscovery, PluginCacheManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { GeneratorBuilder, PreparerBuilder, PublisherBase } from '@backstage/plugin-techdocs-node';
import express, { Response } from 'express';
import { Knex } from 'knex';
import { DocsSynchronizerSyncOpts } from './DocsSynchronizer';
import { DocsBuildStrategy } from './DocsBuildStrategy';
import * as winston from 'winston';
/**
 * Required dependencies for running TechDocs in the "out-of-the-box"
 * deployment configuration (prepare/generate/publish all in the Backend).
 *
 * @public
 */
export declare type OutOfTheBoxDeploymentOptions = {
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
export declare type RecommendedDeploymentOptions = {
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
export declare type RouterOptions = RecommendedDeploymentOptions | OutOfTheBoxDeploymentOptions;
/**
 * Creates a techdocs router.
 *
 * @public
 */
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
/**
 * Create an event-stream response that emits the events 'log', 'error', and 'finish'.
 *
 * @param res - the response to write the event-stream to
 * @returns A tuple of <log, error, finish> callbacks to emit messages. A call to 'error' or 'finish'
 *          will close the event-stream.
 */
export declare function createEventStream(res: Response<any, any>): DocsSynchronizerSyncOpts;
