/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import * as circleci_api from 'circleci-api';
import { CircleCIOptions, BuildSummary, BuildWithSteps } from 'circleci-api';
export { BuildStepAction, BuildSummary, BuildWithSteps, GitType } from 'circleci-api';
import { Entity } from '@backstage/catalog-model';

declare const circleCIPlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;
declare const EntityCircleCIContent: () => JSX.Element;

declare const circleCIApiRef: _backstage_core_plugin_api.ApiRef<CircleCIApi>;
declare type Options = {
    discoveryApi: DiscoveryApi;
    /**
     * Path to use for requests via the proxy, defaults to /circleci/api
     */
    proxyPath?: string;
};
declare class CircleCIApi {
    private readonly discoveryApi;
    private readonly proxyPath;
    constructor(options: Options);
    retry(buildNumber: number, options: Partial<CircleCIOptions>): Promise<BuildSummary>;
    getBuilds({ limit, offset }: {
        limit: number;
        offset: number;
    }, options: Partial<CircleCIOptions>): Promise<circleci_api.BuildSummaryResponse>;
    getUser(options: Partial<CircleCIOptions>): Promise<circleci_api.Me>;
    getBuild(buildNumber: number, options: Partial<CircleCIOptions>): Promise<BuildWithSteps>;
    private getApiUrl;
}

declare const circleCIRouteRef: _backstage_core_plugin_api.RouteRef<undefined>;
declare const circleCIBuildRouteRef: _backstage_core_plugin_api.SubRouteRef<_backstage_core_plugin_api.PathParams<"/:buildId">>;

declare const isCircleCIAvailable: (entity: Entity) => boolean;
declare const Router: () => JSX.Element;

declare const CIRCLECI_ANNOTATION = "circleci.com/project-slug";

export { CIRCLECI_ANNOTATION, CircleCIApi, EntityCircleCIContent, Router, circleCIApiRef, circleCIBuildRouteRef, circleCIPlugin, circleCIRouteRef, isCircleCIAvailable, isCircleCIAvailable as isPluginApplicableToEntity, circleCIPlugin as plugin };
