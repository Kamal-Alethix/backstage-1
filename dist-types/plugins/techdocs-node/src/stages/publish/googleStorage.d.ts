import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { Storage } from '@google-cloud/storage';
import express from 'express';
import { Logger } from 'winston';
import { PublisherBase, PublishRequest, PublishResponse, ReadinessResponse, TechDocsMetadata } from './types';
export declare class GoogleGCSPublish implements PublisherBase {
    private readonly storageClient;
    private readonly bucketName;
    private readonly legacyPathCasing;
    private readonly logger;
    private readonly bucketRootPath;
    constructor(options: {
        storageClient: Storage;
        bucketName: string;
        legacyPathCasing: boolean;
        logger: Logger;
        bucketRootPath: string;
    });
    static fromConfig(config: Config, logger: Logger): PublisherBase;
    /**
     * Check if the defined bucket exists. Being able to connect means the configuration is good
     * and the storage client will work.
     */
    getReadiness(): Promise<ReadinessResponse>;
    /**
     * Upload all the files from the generated `directory` to the GCS bucket.
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
    migrateDocsCase({ removeOriginal, concurrency }: {
        removeOriginal?: boolean | undefined;
        concurrency?: number | undefined;
    }): Promise<void>;
    private getFilesForFolder;
}
