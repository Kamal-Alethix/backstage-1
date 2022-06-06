import { GithubCredentialsProvider, ScmIntegrationRegistry } from '@backstage/integration';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
export declare type Encoding = 'utf-8' | 'base64';
/** @public */
export interface OctokitWithPullRequestPluginClient {
    createPullRequest(options: createPullRequest.Options): Promise<{
        data: {
            html_url: string;
            number: number;
        };
    } | null>;
}
/**
 * The options passed to the client factory function.
 * @public
 */
export declare type CreateGithubPullRequestClientFactoryInput = {
    integrations: ScmIntegrationRegistry;
    githubCredentialsProvider?: GithubCredentialsProvider;
    host: string;
    owner: string;
    repo: string;
    token?: string;
};
export declare const defaultClientFactory: ({ integrations, githubCredentialsProvider, owner, repo, host, token: providedToken, }: CreateGithubPullRequestClientFactoryInput) => Promise<OctokitWithPullRequestPluginClient>;
/**
 * The options passed to {@link createPublishGithubPullRequestAction} method
 * @public
 */
export interface CreateGithubPullRequestActionOptions {
    /**
     * An instance of {@link @backstage/integration#ScmIntegrationRegistry} that will be used in the action.
     */
    integrations: ScmIntegrationRegistry;
    /**
     * An instance of {@link @backstage/integration#GithubCredentialsProvider} that will be used to get credentials for the action.
     */
    githubCredentialsProvider?: GithubCredentialsProvider;
    /**
     * A method to return the Octokit client with the Pull Request Plugin.
     */
    clientFactory?: (input: CreateGithubPullRequestClientFactoryInput) => Promise<OctokitWithPullRequestPluginClient>;
}
/**
 * Creates a Github Pull Request action.
 * @public
 */
export declare const createPublishGithubPullRequestAction: ({ integrations, githubCredentialsProvider, clientFactory, }: CreateGithubPullRequestActionOptions) => import("../..").TemplateAction<{
    title: string;
    branchName: string;
    description: string;
    repoUrl: string;
    draft?: boolean | undefined;
    targetPath?: string | undefined;
    sourcePath?: string | undefined;
    token?: string | undefined;
}>;
