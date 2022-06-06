import { CicdStatisticsApi, CicdState, CicdConfiguration, FetchBuildsOptions } from '@backstage/plugin-cicd-statistics';
import { Gitlab } from '@gitbeaker/browser';
import { OAuthApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
/**
 * This type represents a initialized gitlab client with gitbeaker
 *
 * @public
 */
export declare type GitlabClient = {
    api: InstanceType<typeof Gitlab>;
    owner: string;
};
/**
 * Extracts the CI/CD statistics from a Gitlab repository
 *
 * @public
 */
export declare class CicdStatisticsApiGitlab implements CicdStatisticsApi {
    #private;
    constructor(gitLabAuthApi: OAuthApi);
    createGitlabApi(entity: Entity, scopes: string[]): Promise<GitlabClient>;
    private static updateBuildWithStages;
    private static getDurationOfBuild;
    private static getDefaultBranch;
    fetchBuilds(options: FetchBuildsOptions): Promise<CicdState>;
    getConfiguration(): Promise<Partial<CicdConfiguration>>;
}
