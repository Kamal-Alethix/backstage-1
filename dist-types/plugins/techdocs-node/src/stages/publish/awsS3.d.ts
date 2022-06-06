import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import aws from 'aws-sdk';
import express from 'express';
import { Logger } from 'winston';
import { PublisherBase, PublishRequest, PublishResponse, ReadinessResponse, TechDocsMetadata } from './types';
export declare class AwsS3Publish implements PublisherBase {
    private readonly storageClient;
    private readonly bucketName;
    private readonly legacyPathCasing;
    private readonly logger;
    private readonly bucketRootPath;
    private readonly sse?;
    constructor(options: {
        storageClient: aws.S3;
        bucketName: string;
        legacyPathCasing: boolean;
        logger: Logger;
        bucketRootPath: string;
        sse?: 'aws:kms' | 'AES256';
    });
    static fromConfig(config: Config, logger: Logger): PublisherBase;
    private static buildCredentials;
    /**
     * Check if the defined bucket exists. Being able to connect means the configuration is good
     * and the storage client will work.
     */
    getReadiness(): Promise<ReadinessResponse>;
    /**
     * Upload all the files from the generated `directory` to the S3 bucket.
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
     * Returns a list of all object keys from the configured bucket.
     */
    protected getAllObjectsFromBucket({ prefix }?: {
        prefix: string;
    }): Promise<string[]>;
}
