import { Knex } from 'knex';
import { Logger } from 'winston';
/**
 * Performs the act of stitching - to take all of the various outputs from the
 * ingestion process, and stitching them together into the final entity JSON
 * shape.
 */
export declare class Stitcher {
    private readonly database;
    private readonly logger;
    constructor(database: Knex, logger: Logger);
    stitch(entityRefs: Set<string>): Promise<void>;
    private stitchOne;
}
