/**
 * The Backstage backend plugin that provides the Backstage catalog
 *
 * @packageDocumentation
 */

/// <reference types="node" />

import { CatalogApi } from '@backstage/catalog-client';
import { CatalogEntityDocument } from '@backstage/plugin-catalog-common';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { ConditionalPolicyDecision } from '@backstage/plugin-permission-common';
import { Conditions } from '@backstage/plugin-permission-node';
import { Config } from '@backstage/config';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Entity } from '@backstage/catalog-model';
import { EntityPolicy } from '@backstage/catalog-model';
import { GetEntitiesRequest } from '@backstage/catalog-client';
import { JsonValue } from '@backstage/types';
import { LocationEntityV1alpha1 } from '@backstage/catalog-model';
import { Logger } from 'winston';
import { Permission } from '@backstage/plugin-permission-common';
import { PermissionAuthorizer } from '@backstage/plugin-permission-common';
import { PermissionCondition } from '@backstage/plugin-permission-common';
import { PermissionCriteria } from '@backstage/plugin-permission-common';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { PermissionRule } from '@backstage/plugin-permission-node';
import { PluginDatabaseManager } from '@backstage/backend-common';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Readable } from 'stream';
import { ResourcePermission } from '@backstage/plugin-permission-common';
import { Router } from 'express';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { TokenManager } from '@backstage/backend-common';
import { UrlReader } from '@backstage/backend-common';
import { Validators } from '@backstage/catalog-model';

/** @public */
export declare type AnalyzeLocationEntityField = {
    /**
     * e.g. "spec.owner"? The frontend needs to know how to "inject" the field into the
     * entity again if the user wants to change it
     */
    field: string;
    /** The outcome of the analysis for this particular field */
    state: 'analysisSuggestedValue' | 'analysisSuggestedNoValue' | 'needsUserInput';
    value: string | null;
    /**
     * A text to show to the user to inform about the choices made. Like, it could say
     * "Found a CODEOWNERS file that covers this target, so we suggest leaving this
     * field empty; which would currently make it owned by X" where X is taken from the
     * codeowners file.
     */
    description: string;
};

/**
 * If the folder pointed to already contained catalog info yaml files, they are
 * read and emitted like this so that the frontend can inform the user that it
 * located them and can make sure to register them as well if they weren't
 * already
 * @public
 */
export declare type AnalyzeLocationExistingEntity = {
    location: LocationSpec;
    isRegistered: boolean;
    entity: Entity;
};

/**
 * This is some form of representation of what the analyzer could deduce.
 * We should probably have a chat about how this can best be conveyed to
 * the frontend. It'll probably contain a (possibly incomplete) entity, plus
 * enough info for the frontend to know what form data to show to the user
 * for overriding/completing the info.
 * @public
 */
export declare type AnalyzeLocationGenerateEntity = {
    entity: RecursivePartial<Entity>;
    fields: AnalyzeLocationEntityField[];
};

/** @public */
export declare type AnalyzeLocationRequest = {
    location: LocationSpec;
};

/** @public */
export declare type AnalyzeLocationResponse = {
    existingEntityFiles: AnalyzeLocationExistingEntity[];
    generateEntities: AnalyzeLocationGenerateEntity[];
};

/** @public */
export declare class AnnotateLocationEntityProcessor implements CatalogProcessor {
    private readonly options;
    constructor(options: {
        integrations: ScmIntegrationRegistry;
    });
    getProcessorName(): string;
    preProcessEntity(entity: Entity, location: LocationSpec, _: CatalogProcessorEmit, originLocation: LocationSpec): Promise<Entity>;
}

/** @public */
export declare class AnnotateScmSlugEntityProcessor implements CatalogProcessor {
    private readonly opts;
    constructor(opts: {
        scmIntegrationRegistry: ScmIntegrationRegistry;
    });
    getProcessorName(): string;
    static fromConfig(config: Config): AnnotateScmSlugEntityProcessor;
    preProcessEntity(entity: Entity, location: LocationSpec): Promise<Entity>;
}

/** @public */
export declare class BuiltinKindsEntityProcessor implements CatalogProcessor {
    private readonly validators;
    getProcessorName(): string;
    validateEntityKind(entity: Entity): Promise<boolean>;
    postProcessEntity(entity: Entity, _location: LocationSpec, emit: CatalogProcessorEmit): Promise<Entity>;
}

/**
 * A builder that helps wire up all of the component parts of the catalog.
 *
 * The touch points where you can replace or extend behavior are as follows:
 *
 * - Entity policies can be added or replaced. These are automatically run
 *   after the processors' pre-processing steps. All policies are given the
 *   chance to inspect the entity, and all of them have to pass in order for
 *   the entity to be considered valid from an overall point of view.
 * - Placeholder resolvers can be replaced or added. These run on the raw
 *   structured data between the parsing and pre-processing steps, to replace
 *   dollar-prefixed entries with their actual values (like $file).
 * - Field format validators can be replaced. These check the format of
 *   individual core fields such as metadata.name, to ensure that they adhere
 *   to certain rules.
 * - Processors can be added or replaced. These implement the functionality of
 *   reading, parsing, validating, and processing the entity data before it is
 *   persisted in the catalog.
 *
 * @public
 */
export declare class CatalogBuilder {
    private readonly env;
    private entityPolicies;
    private entityPoliciesReplace;
    private placeholderResolvers;
    private fieldFormatValidators;
    private entityProviders;
    private processors;
    private processorsReplace;
    private parser;
    private processingInterval;
    private locationAnalyzer;
    private permissionRules;
    /**
     * Creates a catalog builder.
     */
    static create(env: CatalogEnvironment): CatalogBuilder;
    private constructor();
    /**
     * Adds policies that are used to validate entities between the pre-
     * processing and post-processing stages. All such policies must pass for the
     * entity to be considered valid.
     *
     * If what you want to do is to replace the rules for what format is allowed
     * in various core entity fields (such as metadata.name), you may want to use
     * {@link CatalogBuilder#setFieldFormatValidators} instead.
     *
     * @param policies - One or more policies
     */
    addEntityPolicy(...policies: Array<EntityPolicy | Array<EntityPolicy>>): CatalogBuilder;
    /**
     * Processing interval determines how often entities should be processed.
     * Seconds provided will be multiplied by 1.5
     * The default processing interval is 100-150 seconds.
     * setting this too low will potentially deplete request quotas to upstream services.
     */
    setProcessingIntervalSeconds(seconds: number): CatalogBuilder;
    /**
     * Overwrites the default processing interval function used to spread
     * entity updates in the catalog.
     */
    setProcessingInterval(processingInterval: ProcessingIntervalFunction): CatalogBuilder;
    /**
     * Overwrites the default location analyzer.
     */
    setLocationAnalyzer(locationAnalyzer: LocationAnalyzer): CatalogBuilder;
    /**
     * Sets what policies to use for validation of entities between the pre-
     * processing and post-processing stages. All such policies must pass for the
     * entity to be considered valid.
     *
     * If what you want to do is to replace the rules for what format is allowed
     * in various core entity fields (such as metadata.name), you may want to use
     * {@link CatalogBuilder#setFieldFormatValidators} instead.
     *
     * This function replaces the default set of policies; use with care.
     *
     * @param policies - One or more policies
     */
    replaceEntityPolicies(policies: EntityPolicy[]): CatalogBuilder;
    /**
     * Adds, or overwrites, a handler for placeholders (e.g. $file) in entity
     * definition files.
     *
     * @param key - The key that identifies the placeholder, e.g. "file"
     * @param resolver - The resolver that gets values for this placeholder
     */
    setPlaceholderResolver(key: string, resolver: PlaceholderResolver): CatalogBuilder;
    /**
     * Sets the validator function to use for one or more special fields of an
     * entity. This is useful if the default rules for formatting of fields are
     * not sufficient.
     *
     * This function has no effect if used together with
     * {@link CatalogBuilder#replaceEntityPolicies}.
     *
     * @param validators - The (subset of) validators to set
     */
    setFieldFormatValidators(validators: Partial<Validators>): CatalogBuilder;
    /**
     * Adds or replaces entity providers. These are responsible for bootstrapping
     * the list of entities out of original data sources. For example, there is
     * one entity source for the config locations, and one for the database
     * stored locations. If you ingest entities out of a third party system, you
     * may want to implement that in terms of an entity provider as well.
     *
     * @param providers - One or more entity providers
     */
    addEntityProvider(...providers: Array<EntityProvider | Array<EntityProvider>>): CatalogBuilder;
    /**
     * Adds entity processors. These are responsible for reading, parsing, and
     * processing entities before they are persisted in the catalog.
     *
     * @param processors - One or more processors
     */
    addProcessor(...processors: Array<CatalogProcessor | Array<CatalogProcessor>>): CatalogBuilder;
    /**
     * Sets what entity processors to use. These are responsible for reading,
     * parsing, and processing entities before they are persisted in the catalog.
     *
     * This function replaces the default set of processors, consider using with
     * {@link CatalogBuilder#getDefaultProcessors}; use with care.
     *
     * @param processors - One or more processors
     */
    replaceProcessors(processors: CatalogProcessor[]): CatalogBuilder;
    /**
     * Returns the default list of entity processors. These are responsible for reading,
     * parsing, and processing entities before they are persisted in the catalog. Changing
     * the order of processing can give more control to custom processors.
     *
     * Consider using with {@link CatalogBuilder#replaceProcessors}
     *
     */
    getDefaultProcessors(): CatalogProcessor[];
    /**
     * Sets up the catalog to use a custom parser for entity data.
     *
     * This is the function that gets called immediately after some raw entity
     * specification data has been read from a remote source, and needs to be
     * parsed and emitted as structured data.
     *
     * @param parser - The custom parser
     */
    setEntityDataParser(parser: CatalogProcessorParser): CatalogBuilder;
    /* Excluded from this release type: addPermissionRules */
    /**
     * Wires up and returns all of the component parts of the catalog
     */
    build(): Promise<{
        processingEngine: CatalogProcessingEngine;
        router: Router;
    }>;
    private buildEntityPolicy;
    private buildProcessors;
    private checkDeprecatedReaderProcessors;
    private checkMissingExternalProcessors;
}

/* Excluded from this release type: catalogConditions */

/** @public */
export declare type CatalogEnvironment = {
    logger: Logger;
    database: PluginDatabaseManager;
    config: Config;
    reader: UrlReader;
    permissions: PermissionEvaluator | PermissionAuthorizer;
};

/* Excluded from this release type: CatalogPermissionRule */

/** @public */
export declare interface CatalogProcessingEngine {
    start(): Promise<void>;
    stop(): Promise<void>;
}

/**
 * @public
 */
export declare type CatalogProcessor = {
    /**
     * A unique identifier for the Catalog Processor.
     */
    getProcessorName(): string;
    /**
     * Reads the contents of a location.
     *
     * @param location - The location to read
     * @param optional - Whether a missing target should trigger an error
     * @param emit - A sink for items resulting from the read
     * @param parser - A parser, that is able to take the raw catalog descriptor
     *               data and turn it into the actual result pieces.
     * @param cache - A cache for storing values local to this processor and the current entity.
     * @returns True if handled by this processor, false otherwise
     */
    readLocation?(location: LocationSpec, optional: boolean, emit: CatalogProcessorEmit, parser: CatalogProcessorParser, cache: CatalogProcessorCache): Promise<boolean>;
    /**
     * Pre-processes an emitted entity, after it has been emitted but before it
     * has been validated.
     *
     * This type of processing usually involves enriching the entity with
     * additional data, and the input entity may actually still be incomplete
     * when the processor is invoked.
     *
     * @param entity - The (possibly partial) entity to process
     * @param location - The location that the entity came from
     * @param emit - A sink for auxiliary items resulting from the processing
     * @param originLocation - The location that the entity originally came from.
     *   While location resolves to the direct parent location, originLocation
     *   tells which location was used to start the ingestion loop.
     * @param cache - A cache for storing values local to this processor and the current entity.
     * @returns The same entity or a modified version of it
     */
    preProcessEntity?(entity: Entity, location: LocationSpec, emit: CatalogProcessorEmit, originLocation: LocationSpec, cache: CatalogProcessorCache): Promise<Entity>;
    /**
     * Validates the entity as a known entity kind, after it has been pre-
     * processed and has passed through basic overall validation.
     *
     * @param entity - The entity to validate
     * @returns Resolves to true, if the entity was of a kind that was known and
     *   handled by this processor, and was found to be valid. Resolves to false,
     *   if the entity was not of a kind that was known by this processor.
     *   Rejects to an Error describing the problem, if the entity was of a kind
     *   that was known by this processor and was not valid.
     */
    validateEntityKind?(entity: Entity): Promise<boolean>;
    /**
     * Post-processes an emitted entity, after it has been validated.
     *
     * @param entity - The entity to process
     * @param location - The location that the entity came from
     * @param emit - A sink for auxiliary items resulting from the processing
     * @param cache - A cache for storing values local to this processor and the current entity.
     * @returns The same entity or a modified version of it
     */
    postProcessEntity?(entity: Entity, location: LocationSpec, emit: CatalogProcessorEmit, cache: CatalogProcessorCache): Promise<Entity>;
};

/**
 * A cache for storing data during processing.
 *
 * The values stored in the cache are always local to each processor, meaning
 * no processor can see cache values from other processors.
 *
 * The cache instance provided to the CatalogProcessor is also scoped to the
 * entity being processed, meaning that each processor run can't see cache
 * values from processing runs for other entities.
 *
 * Values that are set during a processing run will only be visible in the directly
 * following run. The cache will be overwritten every run unless no new cache items
 * are written, in which case the existing values remain in the cache.
 *
 * @public
 */
export declare interface CatalogProcessorCache {
    /**
     * Retrieve a value from the cache.
     */
    get<ItemType extends JsonValue>(key: string): Promise<ItemType | undefined>;
    /**
     * Store a value in the cache.
     */
    set<ItemType extends JsonValue>(key: string, value: ItemType): Promise<void>;
}

/** @public */
export declare type CatalogProcessorEmit = (generated: CatalogProcessorResult) => void;

/** @public */
export declare type CatalogProcessorEntityResult = {
    type: 'entity';
    entity: Entity;
    location: LocationSpec;
};

/** @public */
export declare type CatalogProcessorErrorResult = {
    type: 'error';
    error: Error;
    location: LocationSpec;
};

/** @public */
export declare type CatalogProcessorLocationResult = {
    type: 'location';
    location: LocationSpec;
};

/**
 * A parser, that is able to take the raw catalog descriptor data and turn it
 * into the actual result pieces. The default implementation performs a YAML
 * document parsing.
 * @public
 */
export declare type CatalogProcessorParser = (options: {
    data: Buffer;
    location: LocationSpec;
}) => AsyncIterable<CatalogProcessorResult>;

/** @public */
export declare type CatalogProcessorRelationResult = {
    type: 'relation';
    relation: EntityRelationSpec;
};

/** @public */
export declare type CatalogProcessorResult = CatalogProcessorLocationResult | CatalogProcessorEntityResult | CatalogProcessorRelationResult | CatalogProcessorErrorResult;

/** @public */
export declare class CodeOwnersProcessor implements CatalogProcessor {
    private readonly integrations;
    private readonly logger;
    private readonly reader;
    static fromConfig(config: Config, options: {
        logger: Logger;
        reader: UrlReader;
    }): CodeOwnersProcessor;
    constructor(options: {
        integrations: ScmIntegrationRegistry;
        logger: Logger;
        reader: UrlReader;
    });
    getProcessorName(): string;
    preProcessEntity(entity: Entity, location: LocationSpec): Promise<Entity>;
}

/* Excluded from this release type: createCatalogConditionalDecision */

/* Excluded from this release type: createCatalogPermissionRule */

/**
 * Creates a function that returns a random processing interval between minSeconds and maxSeconds.
 * @returns A {@link ProcessingIntervalFunction} that provides the next processing interval
 * @public
 */
export declare function createRandomProcessingInterval(options: {
    minSeconds: number;
    maxSeconds: number;
}): ProcessingIntervalFunction;

/**
 * @public
 * @deprecated Upgrade to a more recent `@backstage/plugin-search-backend-node` and
 * use `DefaultCatalogCollatorFactory` instead.
 */
export declare class DefaultCatalogCollator {
    protected discovery: PluginEndpointDiscovery;
    protected locationTemplate: string;
    protected filter?: GetEntitiesRequest['filter'];
    protected readonly catalogClient: CatalogApi;
    readonly type: string;
    readonly visibilityPermission: Permission;
    protected tokenManager: TokenManager;
    static fromConfig(_config: Config, options: {
        discovery: PluginEndpointDiscovery;
        tokenManager: TokenManager;
        filter?: GetEntitiesRequest['filter'];
    }): DefaultCatalogCollator;
    constructor(options: {
        discovery: PluginEndpointDiscovery;
        tokenManager: TokenManager;
        locationTemplate?: string;
        filter?: GetEntitiesRequest['filter'];
        catalogClient?: CatalogApi;
    });
    protected applyArgsToFormat(format: string, args: Record<string, string>): string;
    private isUserEntity;
    private getDocumentText;
    execute(): Promise<CatalogEntityDocument[]>;
}

/** @public */
export declare class DefaultCatalogCollatorFactory implements DocumentCollatorFactory {
    readonly type: string;
    readonly visibilityPermission: Permission;
    private locationTemplate;
    private filter?;
    private batchSize;
    private readonly catalogClient;
    private tokenManager;
    static fromConfig(_config: Config, options: DefaultCatalogCollatorFactoryOptions): DefaultCatalogCollatorFactory;
    private constructor();
    getCollator(): Promise<Readable>;
    private applyArgsToFormat;
    private execute;
}

/** @public */
export declare type DefaultCatalogCollatorFactoryOptions = {
    discovery: PluginEndpointDiscovery;
    tokenManager: TokenManager;
    locationTemplate?: string;
    filter?: GetEntitiesRequest['filter'];
    batchSize?: number;
    catalogClient?: CatalogApi;
};

/**
 * Entities that are not yet processed.
 * @public
 */
export declare type DeferredEntity = {
    entity: Entity;
    locationKey?: string;
};

/**
 * Matches rows in the search table.
 * @public
 */
export declare type EntitiesSearchFilter = {
    /**
     * The key to match on.
     *
     * Matches are always case insensitive.
     */
    key: string;
    /**
     * Match on plain equality of values.
     *
     * Match on values that are equal to any of the given array items. Matches are
     * always case insensitive.
     */
    values?: string[];
};

/**
 * A filter expression for entities.
 *
 * Any (at least one) of the outer sets must match, within which all of the
 * individual filters must match.
 * @public
 */
export declare type EntityFilter = {
    allOf: EntityFilter[];
} | {
    anyOf: EntityFilter[];
} | {
    not: EntityFilter;
} | EntitiesSearchFilter;

/**
 * An EntityProvider is able to provide entities to the catalog.
 * See https://backstage.io/docs/features/software-catalog/life-of-an-entity for more details.
 * @public
 */
export declare interface EntityProvider {
    /** Unique provider name used internally for caching. */
    getProviderName(): string;
    /** Connect is called upon initialization by the catalog engine. */
    connect(connection: EntityProviderConnection): Promise<void>;
}

/**
 * The EntityProviderConnection is the connection between the catalog and the entity provider.
 * The EntityProvider use this connection to add and remove entities from the catalog.
 * @public
 */
export declare interface EntityProviderConnection {
    /**
     * Applies either a full or delta update to the catalog engine.
     */
    applyMutation(mutation: EntityProviderMutation): Promise<void>;
}

/**
 * @public
 * A 'full' mutation replaces all existing entities created by this entity provider with new ones.
 * A 'delta' mutation can both add and remove entities provided by this provider. Previously provided
 * entities from a 'full' mutation are not removed.
 */
export declare type EntityProviderMutation = {
    type: 'full';
    entities: DeferredEntity[];
} | {
    type: 'delta';
    added: DeferredEntity[];
    removed: DeferredEntity[];
};

/**
 * Holds the relation data for entities.
 *
 * @public
 */
export declare type EntityRelationSpec = {
    /**
     * The source entity of this relation.
     */
    source: CompoundEntityRef;
    /**
     * The type of the relation.
     */
    type: string;
    /**
     * The target entity of this relation.
     */
    target: CompoundEntityRef;
};

/** @public */
export declare class FileReaderProcessor implements CatalogProcessor {
    getProcessorName(): string;
    readLocation(location: LocationSpec, optional: boolean, emit: CatalogProcessorEmit, parser: CatalogProcessorParser): Promise<boolean>;
}

/** @public */
export declare type LocationAnalyzer = {
    /**
     * Generates an entity configuration for given git repository. It's used for
     * importing new component to the backstage app.
     *
     * @param location - Git repository to analyze and generate config for.
     */
    analyzeLocation(location: AnalyzeLocationRequest): Promise<AnalyzeLocationResponse>;
};

/** @public */
export declare class LocationEntityProcessor implements CatalogProcessor {
    private readonly options;
    constructor(options: LocationEntityProcessorOptions);
    getProcessorName(): string;
    postProcessEntity(entity: Entity, location: LocationSpec, emit: CatalogProcessorEmit): Promise<Entity>;
}

/** @public */
export declare type LocationEntityProcessorOptions = {
    integrations: ScmIntegrationRegistry;
};

/**
 * Holds the entity location information.
 *
 * @remarks
 *
 *  `presence` flag: when using repo importer plugin, location is being created before the component yaml file is merged to the main branch.
 *  This flag is then set to indicate that the file can be not present.
 *  default value: 'required'.
 *
 * @public
 */
export declare type LocationSpec = {
    type: string;
    target: string;
    presence?: 'optional' | 'required';
};

/** @public */
export declare function locationSpecToLocationEntity(opts: {
    location: LocationSpec;
    parentEntity?: Entity;
}): LocationEntityV1alpha1;

/** @public */
export declare function parseEntityYaml(data: Buffer, location: LocationSpec): Iterable<CatalogProcessorResult>;

/* Excluded from this release type: permissionRules */

/**
 * Traverses raw entity JSON looking for occurrences of $-prefixed placeholders
 * that it then fills in with actual data.
 * @public
 */
export declare class PlaceholderProcessor implements CatalogProcessor {
    private readonly options;
    constructor(options: PlaceholderProcessorOptions);
    getProcessorName(): string;
    preProcessEntity(entity: Entity, location: LocationSpec): Promise<Entity>;
}

/** @public */
export declare type PlaceholderProcessorOptions = {
    resolvers: Record<string, PlaceholderResolver>;
    reader: UrlReader;
    integrations: ScmIntegrationRegistry;
};

/** @public */
export declare type PlaceholderResolver = (params: PlaceholderResolverParams) => Promise<JsonValue>;

/** @public */
export declare type PlaceholderResolverParams = {
    key: string;
    value: JsonValue;
    baseUrl: string;
    read: PlaceholderResolverRead;
    resolveUrl: PlaceholderResolverResolveUrl;
};

/** @public */
export declare type PlaceholderResolverRead = (url: string) => Promise<Buffer>;

/** @public */
export declare type PlaceholderResolverResolveUrl = (url: string, base: string) => string;

/**
 * Function that returns the catalog processing interval in seconds.
 * @public
 */
export declare type ProcessingIntervalFunction = () => number;

/**
 * Factory functions for the standard processing result types.
 *
 * @public
 */
export declare const processingResult: Readonly<{
    readonly notFoundError: (atLocation: LocationSpec, message: string) => CatalogProcessorResult;
    readonly inputError: (atLocation: LocationSpec, message: string) => CatalogProcessorResult;
    readonly generalError: (atLocation: LocationSpec, message: string) => CatalogProcessorResult;
    readonly location: (newLocation: LocationSpec) => CatalogProcessorResult;
    readonly entity: (atLocation: LocationSpec, newEntity: Entity) => CatalogProcessorResult;
    readonly relation: (spec: EntityRelationSpec) => CatalogProcessorResult;
}>;

/**
 * Makes all keys of an entire hierarchy optional.
 * @ignore
 */
declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

/** @public */
export declare class UrlReaderProcessor implements CatalogProcessor {
    private readonly options;
    constructor(options: {
        reader: UrlReader;
        logger: Logger;
    });
    getProcessorName(): string;
    readLocation(location: LocationSpec, optional: boolean, emit: CatalogProcessorEmit, parser: CatalogProcessorParser, cache: CatalogProcessorCache): Promise<boolean>;
    private doRead;
}

export { }
