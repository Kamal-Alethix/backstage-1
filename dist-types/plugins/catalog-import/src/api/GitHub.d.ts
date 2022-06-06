import { ScmIntegrationRegistry } from '@backstage/integration';
export declare const getGithubIntegrationConfig: (scmIntegrationsApi: ScmIntegrationRegistry, location: string) => {
    repo: string;
    owner: string;
    githubIntegrationConfig: import("@backstage/integration").GitHubIntegrationConfig;
} | undefined;
