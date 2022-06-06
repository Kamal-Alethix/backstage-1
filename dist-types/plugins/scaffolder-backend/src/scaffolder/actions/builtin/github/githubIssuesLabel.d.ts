import { GithubCredentialsProvider, ScmIntegrationRegistry } from '@backstage/integration';
/**
 * Adds labels to a pull request or issue on GitHub
 * @public
 */
export declare function createGithubIssuesLabelAction(options: {
    integrations: ScmIntegrationRegistry;
    githubCredentialsProvider?: GithubCredentialsProvider;
}): import("../..").TemplateAction<{
    repoUrl: string;
    number: number;
    labels: string[];
    token?: string | undefined;
}>;
