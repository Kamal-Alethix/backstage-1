import { PluginDatabaseManager, UrlReader } from '@backstage/backend-common';
import { EntityPolicy, Validators } from '@backstage/catalog-model';
import { Router } from 'express';
import { CatalogProcessor, CatalogProcessorParser, EntityProvider } from '../api';
import { PlaceholderResolver } from '../modules';
import { LocationAnalyzer } from '../ingestion/types';
import { CatalogProcessingEngine } from '../processing/types';
import { ProcessingIntervalFunction } from '../processing/refresh';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { CatalogPermissionRule } from '../permissions/rules';
import { PermissionAuthorizer, PermissionEvaluator } from '@backstage/plugin-permission-common';
/** @public */
export declare type CatalogEnvironment = {
    logger: Logger;
    database: PluginDatabaseManager;
    config: Config;
    reader: UrlReader;
    permissions: PermissionEvaluator | PermissionAuthorizer;
};
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
    /**
     * Adds additional permission rules. Permission rules are used to evaluate
     * catalog resources against queries. See
     * {@link @backstage/plugin-permission-node#PermissionRule}.
     *
     * @param permissionRules - Additional permission rules
     * @alpha
     */
    addPermissionRules(...permissionRules: Array<CatalogPermissionRule | Array<CatalogPermissionRule>>): void;
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
