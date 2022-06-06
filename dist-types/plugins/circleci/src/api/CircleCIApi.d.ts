import { CircleCIOptions, BuildWithSteps, BuildStepAction, BuildSummary, GitType } from 'circleci-api';
import { DiscoveryApi } from '@backstage/core-plugin-api';
export { GitType };
export type { BuildWithSteps, BuildStepAction, BuildSummary };
export declare const circleCIApiRef: import("@backstage/core-plugin-api").ApiRef<CircleCIApi>;
declare type Options = {
    discoveryApi: DiscoveryApi;
    /**
     * Path to use for requests via the proxy, defaults to /circleci/api
     */
    proxyPath?: string;
};
export declare class CircleCIApi {
    private readonly discoveryApi;
    private readonly proxyPath;
    constructor(options: Options);
    retry(buildNumber: number, options: Partial<CircleCIOptions>): Promise<BuildSummary>;
    getBuilds({ limit, offset }: {
        limit: number;
        offset: number;
    }, options: Partial<CircleCIOptions>): Promise<import("circleci-api").BuildSummaryResponse>;
    getUser(options: Partial<CircleCIOptions>): Promise<import("circleci-api").Me>;
    getBuild(buildNumber: number, options: Partial<CircleCIOptions>): Promise<BuildWithSteps>;
    private getApiUrl;
}
