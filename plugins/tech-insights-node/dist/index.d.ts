import { DateTime, DurationLike, Duration } from 'luxon';
import { Config } from '@backstage/config';
import { PluginEndpointDiscovery, TokenManager } from '@backstage/backend-common';
import { Logger } from 'winston';
import { CheckResult } from '@backstage/plugin-tech-insights-common';

/**
 * A container for facts. The shape of the fact records needs to correspond to the FactSchema with same `ref` value.
 * Each container contains a reference to an entity which can be a Backstage entity or a generic construct
 * outside of backstage with same shape.
 *
 * Container may contain multiple individual facts and their values
 *
 * @public
 */
declare type TechInsightFact = {
    /**
     * Entity reference that this fact relates to
     */
    entity: {
        namespace: string;
        kind: string;
        name: string;
    };
    /**
     * A collection of fact values as key value pairs.
     *
     * Key indicates fact name as it is defined in FactSchema
     */
    facts: Record<string, number | string | boolean | DateTime | number[] | string[] | boolean[] | DateTime[]>;
    /**
     * Optional timestamp value which can be used to override retrieval time of the fact row.
     * Otherwise when stored into data storage, defaults to current time
     */
    timestamp?: DateTime;
};
/**
 * Response type used when returning from database and API.
 * Adds a field for ref for easier usage
 *
 * @public
 */
declare type FlatTechInsightFact = TechInsightFact & {
    /**
     * Reference and unique identifier of the fact row
     */
    id: string;
};
/**
 * A record type to specify individual fact shapes
 *
 * Used as part of a schema to validate, identify and generically construct usage implementations
 * of individual fact values in the system.
 *
 * @public
 */
declare type FactSchema = {
    /**
     * Name of the fact
     */
    [name: string]: {
        /**
         * Type of the individual fact value
         *
         * Numbers are split into integers and floating point values.
         * `set` indicates a collection of values
         */
        type: 'integer' | 'float' | 'string' | 'boolean' | 'datetime' | 'set';
        /**
         * A description of this individual fact value
         */
        description: string;
        /**
         * Optional semver string to indicate when this specific fact definition was added to the schema
         */
        since?: string;
        /**
         * Metadata related to an individual fact.
         * Can contain links, additional description texts and other actionable data.
         *
         * Currently loosely typed, but in the future when patterns emerge, key shapes can be defined
         *
         * examples:
         * ```
         * \{
         *   link: 'https://sonarqube.mycompany.com/fix-these-issues',
         *   suggestion: 'To affect this value, you can do x, y, z',
         *   minValue: 0
         * \}
         * ```
         */
        metadata?: Record<string, any>;
    };
};
/**
 * @public
 *
 * FactRetrieverContext injected into individual handler methods of FactRetriever implementations.
 * The context can be used to construct logic to retrieve entities, contact integration points
 * and fetch and calculate fact values from external sources.
 */
declare type FactRetrieverContext = {
    config: Config;
    discovery: PluginEndpointDiscovery;
    logger: Logger;
    tokenManager: TokenManager;
    entityFilter?: Record<string, string | symbol | (string | symbol)[]>[] | Record<string, string | symbol | (string | symbol)[]>;
};
/**
 * FactRetriever interface
 *
 * @public
 */
interface FactRetriever {
    /**
     * A unique identifier of the retriever.
     * Used to identify and store individual facts returned from this retriever
     * and schemas defined by this retriever.
     */
    id: string;
    /**
     * Semver string indicating the version of this fact retriever
     * This version is used to determine if the schema this fact retriever matches the data this fact retriever provides.
     *
     * Should be incremented on changes to returned data from the handler or if the schema changes.
     */
    version: string;
    /**
     * Handler function that needs to be implemented to retrieve fact values for entities.
     *
     * @param ctx - FactRetrieverContext which can be used to retrieve config and contact integrations
     * @returns - A collection of TechInsightFacts grouped by entities.
     */
    handler: (ctx: FactRetrieverContext) => Promise<TechInsightFact[]>;
    /**
     * A fact schema defining the shape of data returned from the handler method for each entity
     */
    schema: FactSchema;
    /**
     * An optional object/array of objects of entity filters to indicate if this fact retriever is valid for an entity type.
     * If omitted, the retriever should apply to all entities.
     *
     * Should be defined for example:
     *   \{ field: 'kind', values: \['component'\] \}
     *   \{ field: 'metadata.name', values: \['component-1', 'component-2'\] \}
     */
    entityFilter?: Record<string, string | symbol | (string | symbol)[]>[] | Record<string, string | symbol | (string | symbol)[]>;
}
/**
 * A Luxon duration like object for time to live value
 *
 * @public
 * @example
 * \{ timeToLive: 1209600000 \}
 * \{ timeToLive: \{ weeks: 4 \} \}
 *
 **/
declare type TTL = {
    timeToLive: DurationLike;
};
/**
 * A maximum number for items to be kept in the database for each fact retriever/entity pair
 *
 * @public
 * @example
 * \{ maxItems: 10 \}
 *
 **/
declare type MaxItems = {
    maxItems: number;
};
/**
 * A fact lifecycle definition. Determines which strategy to use to purge expired facts from the database.
 *
 * @public
 */
declare type FactLifecycle = TTL | MaxItems;
/**
 * A flat serializable structure for Facts.
 * Containing information about fact schema, version, id, and entity filters
 *
 * @public
 */
declare type FactSchemaDefinition = Omit<FactRetriever, 'handler'>;
/**
 * Registration of a fact retriever
 * Used to add and schedule individual fact retrievers to the fact retriever engine.
 *
 * @public
 */
declare type FactRetrieverRegistration = {
    /**
     * Actual FactRetriever implementation
     */
    factRetriever: FactRetriever;
    /**
     * Cron expression to indicate when the retriever should be triggered.
     * Defaults to a random point in time every 24h
     *
     */
    cadence?: string;
    /**
     * A duration to determine how long the fact retriever should be allowed to run,
     * defaults to 5 minutes.
     *
     */
    timeout?: Duration;
    /**
     * Fact lifecycle definition
     *
     * If defined this value will be used to determine expired items which will deleted when this fact retriever is run
     */
    lifecycle?: FactLifecycle;
};

/**
 * TechInsights Database
 *
 * @public
 */
interface TechInsightsStore {
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

/**
 * A factory wrapper to construct FactChecker implementations.
 *
 * @public
 * @typeParam CheckType - Implementation specific Check. Can extend TechInsightCheck with additional information
 * @typeParam CheckResultType - Implementation specific result of a check. Can extend CheckResult with additional information
 */
interface FactCheckerFactory<CheckType extends TechInsightCheck, CheckResultType extends CheckResult> {
    /**
     * @param repository - TechInsightsStore
     * @returns an implementation of a FactChecker for generic types defined in the factory
     */
    construct(repository: TechInsightsStore): FactChecker<CheckType, CheckResultType>;
}
/**
 * FactChecker interface
 *
 * A generic interface that can be implemented to create checkers for specific check and check return types.
 * This is used especially when creating Scorecards and displaying results of rules when run against facts.
 *
 * @public
 * @typeParam CheckType - Implementation specific Check. Can extend TechInsightCheck with additional information
 * @typeParam CheckResultType - Implementation specific result of a check. Can extend CheckResult with additional information
 */
interface FactChecker<CheckType extends TechInsightCheck, CheckResultType extends CheckResult> {
    /**
     * Runs checks against an entity.
     *
     * @param entity - A reference to an entity to run checks against. In a format namespace/kind/name
     * @param checks - A collection of checks to run against provided entity
     * @returns - A collection containing check/fact information and the actual results of the check
     */
    runChecks(entity: string, checks?: string[]): Promise<CheckResultType[]>;
    /**
     * Retrieves all available checks that can be used to run checks against.
     * The implementation can be just a piping through to CheckRegistry implementation if such is in use.
     *
     * @returns - A collection of checks
     */
    getChecks(): Promise<CheckType[]>;
    /**
     * Validates if check is valid and can be run with the current implementation
     *
     * @param check - The check to be validated
     * @returns - Validation result
     */
    validate(check: CheckType): Promise<CheckValidationResponse>;
}
/**
 * Registry containing checks for tech insights.
 *
 * @public
 * @typeParam CheckType - Implementation specific Check. Can extend TechInsightCheck with additional information
 *
 */
interface TechInsightCheckRegistry<CheckType extends TechInsightCheck> {
    register(check: CheckType): Promise<CheckType>;
    get(checkId: string): Promise<CheckType>;
    getAll(checks: string[]): Promise<CheckType[]>;
    list(): Promise<CheckType[]>;
}
/**
 * Generic definition of a check for Tech Insights
 *
 * @public
 */
interface TechInsightCheck {
    /**
     * Unique identifier of the check
     *
     * Used to identify which checks to use when running checks.
     */
    id: string;
    /**
     * Type identifier for the check.
     * Can be used to determine storage options, logical routing to correct FactChecker implementation
     * or to help frontend render correct component types based on this
     */
    type: string;
    /**
     * Human readable name of the check, may be displayed in the UI
     */
    name: string;
    /**
     * Human readable description of the check, may be displayed in the UI
     */
    description: string;
    /**
     * A collection of string referencing fact rows that a check will be run against.
     *
     * References the fact container, aka fact retriever itself which may or may not contain multiple individual facts and values
     */
    factIds: string[];
    /**
     * Metadata to be returned in case a check has been successfully evaluated
     * Can contain links, description texts or other actionable items
     */
    successMetadata?: Record<string, any>;
    /**
     * Metadata to be returned in case a check evaluation has ended in failure
     * Can contain links, description texts or other actionable items
     */
    failureMetadata?: Record<string, any>;
}
/**
 * Validation response from CheckValidator
 *
 * May contain additional data for display purposes
 * @public
 */
declare type CheckValidationResponse = {
    valid: boolean;
    message?: string;
    errors?: unknown[];
};

export { CheckValidationResponse, FactChecker, FactCheckerFactory, FactLifecycle, FactRetriever, FactRetrieverContext, FactRetrieverRegistration, FactSchema, FactSchemaDefinition, FlatTechInsightFact, MaxItems, TTL, TechInsightCheck, TechInsightCheckRegistry, TechInsightFact, TechInsightsStore };
