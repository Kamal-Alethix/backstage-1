import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import express from 'express';
import { Logger } from 'winston';
import { PublisherBase, PublishRequest, PublishResponse, ReadinessResponse, TechDocsMetadata } from './types';
/**
 * Local publisher which uses the local filesystem to store the generated static files. It uses a directory
 * called "static" at the root of techdocs-backend plugin.
 */
export declare class LocalPublish implements PublisherBase {
    private readonly legacyPathCasing;
    private readonly logger;
    private readonly discovery;
    constructor(options: {
        logger: Logger;
        discovery: PluginEndpointDiscovery;
        legacyPathCasing: boolean;
    });
    static fromConfig(config: Config, logger: Logger, discovery: PluginEndpointDiscovery): PublisherBase;
    getReadiness(): Promise<ReadinessResponse>;
    publish({ entity, directory, }: PublishRequest): Promise<PublishResponse>;
    fetchTechDocsMetadata(entityName: CompoundEntityRef): Promise<TechDocsMetadata>;
    docsRouter(): express.Handler;
    hasDocsBeenGenerated(entity: Entity): Promise<boolean>;
    /**
     * This code will never run in practice. It is merely here to illustrate how
     * to implement this method for other storage providers.
     */
    migrateDocsCase({ removeOriginal, concurrency, }: {
        removeOriginal?: boolean | undefined;
        concurrency?: number | undefined;
    }): Promise<void>;
    /**
     * Utility wrapper around path.join(), used to control legacy case logic.
     */
    protected staticEntityPathJoin(...allParts: string[]): string;
}
