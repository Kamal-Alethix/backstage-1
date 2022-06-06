import { Config } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';
import { LocationSpec } from '../api';
/**
 * Rules to apply to catalog entities.
 *
 * An undefined list of matchers means match all, an empty list of matchers means match none.
 */
export declare type CatalogRule = {
    allow: Array<{
        kind: string;
    }>;
    locations?: Array<{
        target?: string;
        type: string;
    }>;
};
/**
 * Decides whether an entity from a given location is allowed to enter the
 * catalog, according to some rule set.
 */
export declare type CatalogRulesEnforcer = {
    isAllowed(entity: Entity, location: LocationSpec): boolean;
};
/**
 * Implements the default catalog rule set, consuming the config keys
 * `catalog.rules` and `catalog.locations.[].rules`.
 */
export declare class DefaultCatalogRulesEnforcer implements CatalogRulesEnforcer {
    private readonly rules;
    /**
     * Default rules used by the catalog.
     *
     * Denies any location from specifying user or group entities.
     */
    static readonly defaultRules: CatalogRule[];
    /**
     * Loads catalog rules from config.
     *
     * This reads `catalog.rules` and defaults to the default rules if no value is present.
     * The value of the config should be a list of config objects, each with a single `allow`
     * field which in turn is a list of entity kinds to allow.
     *
     * If there is no matching rule to allow an ingested entity, it will be rejected by the catalog.
     *
     * It also reads in rules from `catalog.locations`, where each location can have a list
     * of rules for that specific location, specified in a `rules` field.
     *
     * For example:
     *
     * ```yaml
     * catalog:
     *   rules:
     *   - allow: [Component, API]
     *
     *   locations:
     *   - type: url
     *     target: https://github.com/org/repo/blob/master/users.yaml
     *     rules:
     *       - allow: [User, Group]
     *   - type: url
     *     target: https://github.com/org/repo/blob/master/systems.yaml
     *     rules:
     *       - allow: [System]
     * ```
     */
    static fromConfig(config: Config): DefaultCatalogRulesEnforcer;
    constructor(rules: CatalogRule[]);
    /**
     * Checks whether a specific entity/location combination is allowed
     * according to the configured rules.
     */
    isAllowed(entity: Entity, location: LocationSpec): boolean;
    private matchLocation;
    private matchEntity;
}
