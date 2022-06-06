import { ScmIntegrationRegistry } from '@backstage/integration';
import { Config } from '@backstage/config';
/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to Bitbucket.
 * @public
 * @deprecated in favor of createPublishBitbucketCloudAction and createPublishBitbucketServerAction
 */
export declare function createPublishBitbucketAction(options: {
    integrations: ScmIntegrationRegistry;
    config: Config;
}): import("../..").TemplateAction<{
    repoUrl: string;
    description?: string | undefined;
    defaultBranch?: string | undefined;
    repoVisibility?: "private" | "public" | undefined;
    sourcePath?: string | undefined;
    enableLFS?: boolean | undefined;
    token?: string | undefined;
    gitCommitMessage?: string | undefined;
    gitAuthorName?: string | undefined;
    gitAuthorEmail?: string | undefined;
}>;
