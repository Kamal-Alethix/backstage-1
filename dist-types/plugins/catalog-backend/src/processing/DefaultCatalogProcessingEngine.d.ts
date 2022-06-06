/// <reference types="node" />
import { Hash } from 'crypto';
import { Logger } from 'winston';
import { ProcessingDatabase } from '../database/types';
import { CatalogProcessingEngine, CatalogProcessingOrchestrator } from '../processing/types';
import { Stitcher } from '../stitching/Stitcher';
export declare class DefaultCatalogProcessingEngine implements CatalogProcessingEngine {
    private readonly logger;
    private readonly processingDatabase;
    private readonly orchestrator;
    private readonly stitcher;
    private readonly createHash;
    private readonly pollingIntervalMs;
    private readonly tracker;
    private stopFunc?;
    constructor(logger: Logger, processingDatabase: ProcessingDatabase, orchestrator: CatalogProcessingOrchestrator, stitcher: Stitcher, createHash: () => Hash, pollingIntervalMs?: number);
    start(): Promise<void>;
    stop(): Promise<void>;
}
