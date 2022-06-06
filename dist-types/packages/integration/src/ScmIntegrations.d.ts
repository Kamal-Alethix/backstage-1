import { Config } from '@backstage/config';
import { AwsS3Integration } from './awsS3/AwsS3Integration';
import { AzureIntegration } from './azure/AzureIntegration';
import { BitbucketCloudIntegration } from './bitbucketCloud/BitbucketCloudIntegration';
import { BitbucketIntegration } from './bitbucket/BitbucketIntegration';
import { BitbucketServerIntegration } from './bitbucketServer/BitbucketServerIntegration';
import { GerritIntegration } from './gerrit/GerritIntegration';
import { GitHubIntegration } from './github/GitHubIntegration';
import { GitLabIntegration } from './gitlab/GitLabIntegration';
import { ScmIntegration, ScmIntegrationsGroup } from './types';
import { ScmIntegrationRegistry } from './registry';
/**
 * The set of supported integrations.
 *
 * @public
 */
export interface IntegrationsByType {
    awsS3: ScmIntegrationsGroup<AwsS3Integration>;
    azure: ScmIntegrationsGroup<AzureIntegration>;
    /**
     * @deprecated in favor of `bitbucketCloud` and `bitbucketServer`
     */
    bitbucket: ScmIntegrationsGroup<BitbucketIntegration>;
    bitbucketCloud: ScmIntegrationsGroup<BitbucketCloudIntegration>;
    bitbucketServer: ScmIntegrationsGroup<BitbucketServerIntegration>;
    gerrit: ScmIntegrationsGroup<GerritIntegration>;
    github: ScmIntegrationsGroup<GitHubIntegration>;
    gitlab: ScmIntegrationsGroup<GitLabIntegration>;
}
/**
 * Exposes the set of supported integrations.
 *
 * @public
 */
export declare class ScmIntegrations implements ScmIntegrationRegistry {
    private readonly byType;
    static fromConfig(config: Config): ScmIntegrations;
    constructor(integrationsByType: IntegrationsByType);
    get awsS3(): ScmIntegrationsGroup<AwsS3Integration>;
    get azure(): ScmIntegrationsGroup<AzureIntegration>;
    /**
     * @deprecated in favor of `bitbucketCloud()` and `bitbucketServer()`
     */
    get bitbucket(): ScmIntegrationsGroup<BitbucketIntegration>;
    get bitbucketCloud(): ScmIntegrationsGroup<BitbucketCloudIntegration>;
    get bitbucketServer(): ScmIntegrationsGroup<BitbucketServerIntegration>;
    get gerrit(): ScmIntegrationsGroup<GerritIntegration>;
    get github(): ScmIntegrationsGroup<GitHubIntegration>;
    get gitlab(): ScmIntegrationsGroup<GitLabIntegration>;
    list(): ScmIntegration[];
    byUrl(url: string | URL): ScmIntegration | undefined;
    byHost(host: string): ScmIntegration | undefined;
    resolveUrl(options: {
        url: string;
        base: string;
        lineNumber?: number;
    }): string;
    resolveEditUrl(url: string): string;
}
