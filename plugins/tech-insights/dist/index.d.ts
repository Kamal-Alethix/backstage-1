/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { CheckResult, BulkCheckResponse } from '@backstage/plugin-tech-insights-common';
import React from 'react';
import { CompoundEntityRef } from '@backstage/catalog-model';

/**
 * @public
 */
declare const techInsightsPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
/**
 * @public
 */
declare const EntityTechInsightsScorecardContent: ({ title, description, checksId, }: {
    title?: string | undefined;
    description?: string | undefined;
    checksId?: string[] | undefined;
}) => JSX.Element;
/**
 * @public
 */
declare const EntityTechInsightsScorecardCard: ({ title, description, checksId, }: {
    title?: string | undefined;
    description?: string | undefined;
    checksId?: string[] | undefined;
}) => JSX.Element;

/**
 * Represents a single check defined on the TechInsights backend.
 *
 * @public
 */
declare type Check = {
    id: string;
    type: string;
    name: string;
    description: string;
    factIds: string[];
};

/**
 * Defines a react component that is responsible for rendering a results of a given type.
 *
 * @public
 */
declare type CheckResultRenderer = {
    type: string;
    title: string;
    description: string;
    component: React.ReactElement;
};

/**
 * {@link @backstage/core-plugin-api#ApiRef} for the {@link TechInsightsApi}
 *
 * @public
 */
declare const techInsightsApiRef: _backstage_core_plugin_api.ApiRef<TechInsightsApi>;
/**
 * API client interface for the Tech Insights plugin
 *
 * @public
 */
interface TechInsightsApi {
    getScorecardsDefinition: (type: string, value: CheckResult[], title?: string, description?: string) => CheckResultRenderer | undefined;
    getAllChecks(): Promise<Check[]>;
    runChecks(entityParams: CompoundEntityRef, checks?: string[]): Promise<CheckResult[]>;
    runBulkChecks(entities: CompoundEntityRef[], checks?: Check[]): Promise<BulkCheckResponse>;
}

/** @public */
declare class TechInsightsClient implements TechInsightsApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
    });
    getScorecardsDefinition(type: string, value: CheckResult[], title?: string, description?: string): CheckResultRenderer | undefined;
    getAllChecks(): Promise<Check[]>;
    runChecks(entityParams: CompoundEntityRef, checks?: string[]): Promise<CheckResult[]>;
    runBulkChecks(entities: CompoundEntityRef[], checks?: Check[]): Promise<BulkCheckResponse>;
}

export { Check, CheckResultRenderer, EntityTechInsightsScorecardCard, EntityTechInsightsScorecardContent, TechInsightsApi, TechInsightsClient, techInsightsApiRef, techInsightsPlugin };
