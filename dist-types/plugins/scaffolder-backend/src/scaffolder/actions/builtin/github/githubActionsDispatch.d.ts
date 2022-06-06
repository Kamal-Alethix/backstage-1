import { GithubCredentialsProvider, ScmIntegrations } from '@backstage/integration';
/**
 * Creates a new action that dispatches a GitHub Action workflow for a given branch or tag.
 * @public
 */
export declare function createGithubActionsDispatchAction(options: {
    integrations: ScmIntegrations;
    githubCredentialsProvider?: GithubCredentialsProvider;
}): import("../..").TemplateAction<{
    repoUrl: string;
    workflowId: string;
    branchOrTagName: string;
    workflowInputs?: {
        [key: string]: string;
    } | undefined;
    token?: string | undefined;
}>;
