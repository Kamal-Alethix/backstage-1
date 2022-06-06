import { BlobServiceClient } from '@azure/storage-blob';
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import express from 'express';
import { Logger } from 'winston';
import { PublisherBase, PublishRequest, PublishResponse, ReadinessResponse, TechDocsMetadata } from './types';
export declare class AzureBlobStoragePublish implements PublisherBase {
    private readonly storageClient;
    private readonly containerName;
    private readonly legacyPathCasing;
    private readonly logger;
    constructor(options: {
        storageClient: BlobServiceClient;
        containerName: string;
        legacyPathCasing: boolean;
        logger: Logger;
    });
    static fromConfig(config: Config, logger: Logger): PublisherBase;
    getReadiness(): Promise<ReadinessResponse>;
    /**
     * Upload all the files from the generated `directory` to the Azure Blob Storage container.
     * Directory structure used in the container is - entityNamespace/entityKind/entityName/index.html
     */
    publish({ entity, directory, }: PublishRequest): Promise<PublishResponse>;
    private download;
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
    protected renameBlob(originalName: string, newName: string, removeOriginal?: boolean): Promise<void>;
    protected renameBlobToLowerCase(originalPath: string, removeOriginal: boolean): Promise<void>;
    migrateDocsCase({ removeOriginal, concurrency, }: {
        removeOriginal?: boolean | undefined;
        concurrency?: number | undefined;
    }): Promise<void>;
    protected getAllBlobsFromContainer({ prefix, maxPageSize, }: {
        prefix: string;
        maxPageSize: number;
    }): Promise<string[]>;
}
