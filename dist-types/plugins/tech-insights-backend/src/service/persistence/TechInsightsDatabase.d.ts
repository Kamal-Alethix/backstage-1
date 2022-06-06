import { Knex } from 'knex';
import { FactLifecycle, FactSchema, FactSchemaDefinition, FlatTechInsightFact, TechInsightFact, TechInsightsStore } from '@backstage/plugin-tech-insights-node';
import { DateTime } from 'luxon';
import { Logger } from 'winston';
export declare type RawDbFactRow = {
    id: string;
    version: string;
    timestamp: Date | string;
    entity: string;
    facts: string;
};
export declare class TechInsightsDatabase implements TechInsightsStore {
    private readonly db;
    private readonly logger;
    private readonly CHUNK_SIZE;
    constructor(db: Knex, logger: Logger);
    getLatestSchemas(ids?: string[]): Promise<FactSchema[]>;
    insertFactSchema(schemaDefinition: FactSchemaDefinition): Promise<void>;
    insertFacts({ id, facts, lifecycle, }: {
        id: string;
        facts: TechInsightFact[];
        lifecycle?: FactLifecycle;
    }): Promise<void>;
    getLatestFactsByIds(ids: string[], entityTriplet: string): Promise<{
        [factId: string]: FlatTechInsightFact;
    }>;
    getFactsBetweenTimestampsByIds(ids: string[], entityTriplet: string, startDateTime: DateTime, endDateTime: DateTime): Promise<{
        [factId: string]: FlatTechInsightFact[];
    }>;
    private getLatestSchema;
    private deleteExpiredFactsByDate;
    private deleteExpiredFactsByNumber;
    private dbFactRowsToTechInsightFacts;
}
