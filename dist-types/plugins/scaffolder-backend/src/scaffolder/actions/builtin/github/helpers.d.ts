import { GithubCredentialsProvider, ScmIntegrationRegistry } from '@backstage/integration';
import { OctokitOptions } from '@octokit/core/dist-types/types';
export declare function getOctokitOptions(options: {
    integrations: ScmIntegrationRegistry;
    credentialsProvider?: GithubCredentialsProvider;
    token?: string;
    repoUrl: string;
}): Promise<OctokitOptions>;
