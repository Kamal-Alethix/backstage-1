import { GithubCredentialsProvider, ScmIntegrationRegistry } from '@backstage/integration';
/**
 * Creates new action that creates a webhook for a repository on GitHub.
 * @public
 */
export declare function createGithubWebhookAction(options: {
    integrations: ScmIntegrationRegistry;
    defaultWebhookSecret?: string;
    githubCredentialsProvider?: GithubCredentialsProvider;
}): import("../..").TemplateAction<{
    repoUrl: string;
    webhookUrl: string;
    webhookSecret?: string | undefined;
    events?: string[] | undefined;
    active?: boolean | undefined;
    contentType?: "form" | "json" | undefined;
    insecureSsl?: boolean | undefined;
    token?: string | undefined;
}>;
