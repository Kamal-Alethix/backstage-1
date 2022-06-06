import express from 'express';
import Router from 'express-promise-router';
import { DefinitivePolicyDecision, IdentifiedPermissionMessage, PermissionCondition, PermissionCriteria } from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';
/**
 * A request to load the referenced resource and apply conditions in order to
 * finalize a conditional authorization response.
 *
 * @public
 */
export declare type ApplyConditionsRequestEntry = IdentifiedPermissionMessage<{
    resourceRef: string;
    resourceType: string;
    conditions: PermissionCriteria<PermissionCondition>;
}>;
/**
 * A batch of {@link ApplyConditionsRequestEntry} objects.
 *
 * @public
 */
export declare type ApplyConditionsRequest = {
    items: ApplyConditionsRequestEntry[];
};
/**
 * The result of applying the conditions, expressed as a definitive authorize
 * result of ALLOW or DENY.
 *
 * @public
 */
export declare type ApplyConditionsResponseEntry = IdentifiedPermissionMessage<DefinitivePolicyDecision>;
/**
 * A batch of {@link ApplyConditionsResponseEntry} objects.
 *
 * @public
 */
export declare type ApplyConditionsResponse = {
    items: ApplyConditionsResponseEntry[];
};
/**
 * Prevent use of type parameter from contributing to type inference.
 *
 * https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-980401795
 * @ignore
 */
declare type NoInfer<T> = T extends infer S ? S : never;
/**
 * Create an express Router which provides an authorization route to allow
 * integration between the permission backend and other Backstage backend
 * plugins. Plugin owners that wish to support conditional authorization for
 * their resources should add the router created by this function to their
 * express app inside their `createRouter` implementation.
 *
 * @remarks
 *
 * To make this concrete, we can use the Backstage software catalog as an
 * example. The catalog has conditional rules around access to specific
 * _entities_ in the catalog. The _type_ of resource is captured here as
 * `resourceType`, a string identifier (`catalog-entity` in this example) that
 * can be provided with permission definitions. This is merely a _type_ to
 * verify that conditions in an authorization policy are constructed correctly,
 * not a reference to a specific resource.
 *
 * The `rules` parameter is an array of {@link PermissionRule}s that introduce
 * conditional filtering logic for resources; for the catalog, these are things
 * like `isEntityOwner` or `hasAnnotation`. Rules describe how to filter a list
 * of resources, and the `conditions` returned allow these rules to be applied
 * with specific parameters (such as 'group:default/team-a', or
 * 'backstage.io/edit-url').
 *
 * The `getResources` argument should load resources based on a reference
 * identifier. For the catalog, this is an
 * {@link @backstage/catalog-model#EntityRef}. For other plugins, this can be
 * any serialized format. This is used to construct the
 * `createPermissionIntegrationRouter`, a function to add an authorization route
 * to your backend plugin. This function will be called by the
 * `permission-backend` when authorization conditions relating to this plugin
 * need to be evaluated.
 *
 * @public
 */
export declare const createPermissionIntegrationRouter: <TResourceType extends string, TResource>(options: {
    resourceType: TResourceType;
    rules: PermissionRule<TResource, any, NoInfer<TResourceType>, unknown[]>[];
    getResources: (resourceRefs: string[]) => Promise<(TResource | undefined)[]>;
}) => express.Router;
export {};
