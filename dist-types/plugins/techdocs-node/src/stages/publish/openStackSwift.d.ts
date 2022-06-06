import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import express from 'express';
import { SwiftClient } from '@trendyol-js/openstack-swift-sdk';
import { Logger } from 'winston';
import { PublisherBase, PublishRequest, PublishResponse, ReadinessResponse, TechDocsMetadata } from './types';
export declare class OpenStackSwiftPublish implements PublisherBase {
    private readonly storageClient;
    private readonly containerName;
    private readonly logger;
    constructor(options: {
        storageClient: SwiftClient;
        containerName: string;
        logger: Logger;
    });
    static fromConfig(config: Config, logger: Logger): PublisherBase;
    getReadiness(): Promise<ReadinessResponse>;
    /**
     * Upload all the files from the generated `directory` to the OpenStack Swift container.
     * Directory structure used in the bucket is - entityNamespace/entityKind/entityName/index.html
     */
    publish({ entity, directory, }: PublishRequest): Promise<PublishResponse>;
    fetchTechDocsMetadata(entityName: CompoundEntityRef): Promise<TechDocsMetadata>;
    /**
     * Express route middleware to serve static files on a route in techdocs-backend.
     */
    docsRouter(): express.Handler;
    /**
     * A helper function which checks if index.html of an Entity's docs site is available. This
     * can be used to verify if there are any pre-generated docs available to serve.
     */
    hasDocsBeenGenerated(entity: Entity): Promise<boolean>;
    migrateDocsCase({ removeOriginal, concurrency, }: {
        removeOriginal?: boolean | undefined;
        concurrency?: number | undefined;
    }): Promise<void>;
    /**
     * Returns a list of all object keys from the configured container.
     */
    protected getAllObjectsFromContainer({ prefix }?: {
        prefix: string;
    }): Promise<string[]>;
}
