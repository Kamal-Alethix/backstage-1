import { FactSchema, TechInsightFact, FlatTechInsightFact, FactSchemaDefinition, FactLifecycle } from './facts';
import { DateTime } from 'luxon';
/**
 * TechInsights Database
 *
 * @public
 */
export interface TechInsightsStore {
    /**
     * Stores fact containers as rows into data store.
     * Individual items in array correspond to a fact schema based on reference and entity based on entity identifier.
     *
     * Each row may contain multiple individual facts and values
     *
     * @param id - Unique identifier of the fact retriever these facts relate to
     * @param facts - A collection of TechInsightFacts
     * @param lifecycle - (Optional) Fact lifecycle object indicating the expiration logic for these items
     */
    insertFacts({ id, facts, lifecycle, }: {
        id: string;
        facts: TechInsightFact[];
        lifecycle?: FactLifecycle;
    }): Promise<void>;
    /**
     * @param ids - A collection of fact row identifiers
     * @param entity - A string identifying an entity. In a format namespace/kind/name
     *
     * @returns - An object keyed by a fact reference and containing an individual TechInsightFact
     */
    getLatestFactsByIds(ids: string[], entity: string): Promise<{
        [factRef: string]: FlatTechInsightFact;
    }>;
    /**
     * Retrieves fact values identified by fact row references for an individual entity.
     *
     * @param ids - A collection of fact row identifiers
     * @param entity - A string identifying an entity. In a format namespace/kind/name
     * @param startDateTime - DateTime object indicating start of the time frame
     * @param endDateTime - DateTime object indicating start of the time frame
     *
     * @returns - An object keyed by a fact reference and containing a collection of TechInsightFacts matching the time frame
     */
    getFactsBetweenTimestampsByIds(ids: string[], entity: string, startDateTime: DateTime, endDateTime: DateTime): Promise<{
        [factRef: string]: FlatTechInsightFact[];
    }>;
    /**
     * Stores versioned fact schemas into data store
     *
     * @param schemaDefinition - FactSchemaDefinition containing id, version, schema and entityTypes.
     */
    insertFactSchema(schemaDefinition: FactSchemaDefinition): Promise<void>;
    /**
     * Retrieves latest versions (as defined by semver) of fact schemas from the data store.
     *
     * @param ids - Collection of ids to return. If omitted, all Schemas should be returned.
     * @returns - A collection of schemas
     */
    getLatestSchemas(ids?: string[]): Promise<FactSchema[]>;
}
